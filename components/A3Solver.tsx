import React, { useState } from 'react';
import { generateA3Report } from '../services/geminiService';
import { A3Report } from '../types';
import { FileSpreadsheet, Loader2, Sparkles, FileText, ArrowDown } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SmartTextarea from './SmartTextarea';

const A3Solver: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<A3Report | null>(null);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setReport(null);
    try {
      const result = await generateA3Report(input);
      setReport(result);
      addToast("تم إنشاء مسودة A3 بنجاح", "success");
    } catch (e) {
      addToast("فشل في إنشاء التقرير", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
       <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <FileSpreadsheet className="text-blue-600" size={32} />
          <span>محلل المشكلات A3 الذكي</span>
        </h2>
        <p className="text-slate-500">صف المشكلة وسيقوم النظام ببناء تقرير A3 كامل يتضمن التحليل والحلول المقترحة.</p>
      </header>

      {!report ? (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <label className="block text-lg font-bold text-slate-800 mb-4">ما هي المشكلة التي تريد حلها؟</label>
            <SmartTextarea
              value={input}
              onValueChange={setInput}
              placeholder="مثال: ارتفاع نسبة المرتجعات في خط إنتاج الملابس بنسبة 15% خلال الشهر الماضي بسبب عيوب في الخياطة..."
              className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-6"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> جاري التفكير بعمق...
                  </>
              ) : (
                  <>
                    <Sparkles size={20} /> توليد تقرير A3
                  </>
              )}
            </button>
        </div>
      ) : (
        <div className="animate-slide-in space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <button 
                    onClick={() => setReport(null)}
                    className="text-slate-500 hover:text-slate-800 font-medium"
                >
                    &larr; مسألة جديدة
                </button>
                <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">مسودة أولية</span>
                </div>
            </div>

            {/* A3 Layout Grid */}
            <div className="bg-white rounded-none shadow-2xl border border-slate-300 p-8 min-h-[1000px] aspect-[1.414/1] mx-auto relative overflow-hidden">
                {/* Header */}
                <div className="border-b-4 border-slate-800 pb-4 mb-6 flex justify-between items-end">
                    <h1 className="text-3xl font-black text-slate-900 uppercase">{report.theme}</h1>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">تم التوليد بواسطة LeanMaster AI</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <Section title="1. الخلفية (Background)" content={report.background} />
                        <Section title="2. الوضع الحالي (Current Condition)" content={report.currentCondition} />
                        <Section title="3. الهدف (Goal/Target)" content={report.goal} />
                        <Section title="4. تحليل السبب الجذري (Root Cause)" content={report.rootCauseAnalysis} />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                         <Section title="5. الإجراءات المضادة (Countermeasures)" content={report.countermeasures} />
                         
                         <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 h-auto">
                            <h3 className="font-bold text-slate-900 bg-slate-200 px-2 py-1 inline-block rounded mb-3">6. خطة التنفيذ (Implementation Plan)</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                                {report.implementationPlan.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                         </div>

                         <Section title="7. المتابعة (Follow-up)" content={report.followUp} />
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const Section: React.FC<{title: string, content: string}> = ({title, content}) => (
    <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
        <h3 className="font-bold text-slate-900 bg-slate-200 px-2 py-1 inline-block rounded mb-2">{title}</h3>
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{content}</p>
    </div>
);

export default A3Solver;
