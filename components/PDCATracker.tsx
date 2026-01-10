import React, { useState } from 'react';
import { generatePDCAPlan } from '../services/geminiService';
import { PDCAPlan } from '../types';
import { RotateCw, Loader2, CheckSquare, Target, Zap, BarChart3, Repeat } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SmartTextarea from './SmartTextarea';

const PDCATracker: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdca, setPdca] = useState<PDCAPlan | null>(null);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setPdca(null);
    try {
      const result = await generatePDCAPlan(input);
      setPdca(result);
      addToast("تم إنشاء خطة PDCA بنجاح", "success");
    } catch (e) {
      addToast("فشل في إنشاء الخطة", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <RotateCw className="text-blue-600" size={32} />
          <span>دورة التحسين (PDCA)</span>
        </h2>
        <p className="text-slate-500">خطط - نفذ - تحقق - صحح. منهجية مستمرة للتحسين.</p>
      </header>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">ما هو الهدف أو العملية التي تريد تحسينها؟</label>
        <SmartTextarea
          value={input}
          onValueChange={setInput}
          placeholder="مثال: تقليل وقت التغيير (Changeover) في ماكينة التغليف..."
          className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> جاري التخطيط للدورة...
            </>
          ) : (
            <>
              <RotateCw size={20} /> بدء دورة PDCA
            </>
          )}
        </button>
      </div>

      {/* Cycle Display */}
      {pdca && (
        <div className="animate-slide-in">
             <h3 className="text-center text-xl font-bold text-slate-800 mb-8">{pdca.title}</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Center Connection (Desktop only) */}
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-10 shadow-lg flex items-center justify-center border-4 border-slate-100">
                    <Repeat className="text-slate-400" size={24} />
                </div>

                {/* PLAN */}
                <div className="bg-white rounded-2xl p-6 border-t-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <Target size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">1. خطط (Plan)</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">الهدف:</p>
                            <p className="text-slate-700 font-medium">{pdca.plan.objective}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <ul className="space-y-2">
                                {pdca.plan.steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shrink-0 border border-blue-100">{idx+1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* DO */}
                <div className="bg-white rounded-2xl p-6 border-t-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">2. نفذ (Do)</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-xl">
                            <p className="text-xs font-bold text-amber-800 uppercase mb-2">الإجراءات:</p>
                            <ul className="space-y-2">
                                {pdca.do.actions.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <CheckSquare size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                             <p className="text-xs font-bold text-slate-500 uppercase mb-1">الموارد المطلوبة:</p>
                             <div className="flex flex-wrap gap-2">
                                {pdca.do.resources.map((res, i) => (
                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{res}</span>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>

                {/* CHECK */}
                <div className="bg-white rounded-2xl p-6 border-t-4 border-red-500 shadow-sm hover:shadow-md transition-shadow md:order-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                            <BarChart3 size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">3. تحقق (Check)</h4>
                    </div>
                     <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-xl">
                             <p className="text-xs font-bold text-red-800 uppercase mb-2">مؤشرات الأداء (KPIs):</p>
                             <ul className="space-y-2">
                                {pdca.check.kpis.map((kpi, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                        <span>{kpi}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold">تاريخ المراجعة:</span>
                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700">{pdca.check.reviewDate}</span>
                        </div>
                    </div>
                </div>

                {/* ACT */}
                <div className="bg-white rounded-2xl p-6 border-t-4 border-green-500 shadow-sm hover:shadow-md transition-shadow md:order-3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                            <RotateCw size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">4. صحح (Act)</h4>
                    </div>
                    <div className="space-y-4">
                         <div className="bg-green-50 p-4 rounded-xl">
                            <p className="text-xs font-bold text-green-800 uppercase mb-1">التقييس (Standardization):</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{pdca.act.standardization}</p>
                        </div>
                        <div>
                             <p className="text-xs font-bold text-slate-500 uppercase mb-1">الخطوات المستقبلية:</p>
                             <p className="text-sm text-slate-600">{pdca.act.futureImprovements}</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default PDCATracker;
