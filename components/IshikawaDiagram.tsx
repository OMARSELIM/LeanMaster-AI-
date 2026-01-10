import React, { useState } from 'react';
import { generateIshikawa } from '../services/geminiService';
import { IshikawaDiagram as IshikawaType } from '../types';
import { GitBranch, Loader2, Share2, Fish } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SmartTextarea from './SmartTextarea';

const IshikawaDiagram: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagram, setDiagram] = useState<IshikawaType | null>(null);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setDiagram(null);
    try {
      const result = await generateIshikawa(input);
      setDiagram(result);
      addToast("تم إنشاء مخطط عظم السمكة بنجاح", "success");
    } catch (e) {
      addToast("فشل في إنشاء المخطط", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Fish className="text-teal-500" size={32} />
          <span>مخطط إيشيكاوا (عظم السمكة)</span>
        </h2>
        <p className="text-slate-500">تحليل الأسباب الجذرية وتصنيفها وفق التاءات الستة (6Ms).</p>
      </header>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">ما هي المشكلة التي تريد تحليل أسبابها؟</label>
        <SmartTextarea
          value={input}
          onValueChange={setInput}
          placeholder="مثال: انخفاض جودة اللحام في خط الإنتاج رقم 2..."
          className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none mb-4"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> جاري رسم العظام...
            </>
          ) : (
            <>
              <GitBranch size={20} /> تحليل الأسباب (6Ms)
            </>
          )}
        </button>
      </div>

      {/* Diagram Display */}
      {diagram && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-slide-in relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#0f766e 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>

            <div className="relative z-10">
                <h3 className="text-center text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm ml-2">المشكلة</span>
                    {diagram.problem}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {diagram.categories.map((cat, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
                                <h4 className="font-bold text-slate-800">{cat.category}</h4>
                                <Share2 size={16} className="text-slate-400 opacity-50" />
                            </div>
                            <ul className="p-4 space-y-2">
                                {cat.causes.map((cause, cIdx) => (
                                    <li key={cIdx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0"></span>
                                        <span>{cause}</span>
                                    </li>
                                ))}
                                {cat.causes.length === 0 && (
                                    <li className="text-xs text-slate-400 italic">لا توجد أسباب محتملة في هذه الفئة</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
                
                {/* Visual Spine Representation (Decorative) */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default IshikawaDiagram;
