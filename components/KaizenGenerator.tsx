import React, { useState } from 'react';
import { generateKaizenIdeas } from '../services/geminiService';
import { KaizenSuggestion } from '../types';
import { Sparkles, ArrowLeft, Loader2, Gauge, Target, Lightbulb } from 'lucide-react';

const KaizenGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KaizenSuggestion | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const suggestion = await generateKaizenIdeas(input);
      setResult(suggestion);
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Lightbulb className="text-yellow-500" size={32} />
          <span>مُولّد أفكار كايزن</span>
        </h2>
        <p className="text-slate-500">صف المشكلة، وسيقوم الذكاء الاصطناعي باقتراح تحسينات هيكلية وفق منهجية Lean.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="problem" className="block text-sm font-semibold text-slate-700">
              وصف المشكلة / الفرصة
            </label>
            <textarea
              id="problem"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="مثال: هناك تأخير دائم في تسليم المواد الخام من المستودع إلى خط الإنتاج رقم 3 مما يسبب توقف العمال..."
              className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>جاري التحليل...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>توليد الحل</span>
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8 animation-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{result.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wide">بيان المشكلة</h4>
                <p className="text-slate-700 leading-relaxed">{result.problemStatement}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wide">السبب الجذري المحتمل</h4>
                <p className="text-slate-700 leading-relaxed">{result.rootCause}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
                <h4 className="text-sm font-bold text-green-600 mb-2 uppercase tracking-wide">الإجراء المضاد (الحل)</h4>
                <p className="text-slate-700 leading-relaxed font-medium">{result.countermeasure}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
                <h4 className="text-sm font-bold text-blue-500 mb-2 uppercase tracking-wide">الفائدة المتوقعة</h4>
                <p className="text-slate-700 leading-relaxed">{result.expectedBenefit}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">الجهد المبذول</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.effort === 'High' ? 'bg-red-100 text-red-700' :
                  result.effort === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>{result.effort}</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">الأثر المتوقع</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.impact === 'High' ? 'bg-green-100 text-green-700' :
                  result.impact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>{result.impact}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KaizenGenerator;