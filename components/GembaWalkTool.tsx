import React, { useState } from 'react';
import { generateGembaChecklist } from '../services/geminiService';
import { GembaChecklist } from '../types';
import { ClipboardList, Loader2, CheckSquare, Printer, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const GembaWalkTool: React.FC = () => {
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState<GembaChecklist | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim()) return;

    setLoading(true);
    setChecklist(null);
    setCheckedItems({});

    try {
      const result = await generateGembaChecklist(area);
      setChecklist(result);
      addToast("تم إنشاء قائمة التحقق بنجاح", "success");
    } catch (error) {
      addToast("حدث خطأ أثناء إنشاء القائمة", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-0">
      <header className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <ClipboardList className="text-purple-500" size={28} />
          <span>مساعد جولات الجيمبا</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500">قم بتوليد قائمة تفقد مخصصة لجولتك الميدانية القادمة في موقع العمل.</p>
      </header>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">المنطقة أو العملية المراد تفقدها</label>
            <div className="relative">
                <MapPin className="absolute right-3 top-3.5 text-slate-400" size={20} />
                <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="مثال: خط تعبئة الزجاجات، مستودع المواد الكيميائية..."
                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
                />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !area.trim()}
              className="w-full md:w-auto h-[50px] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20 active:scale-[0.98] md:active:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'إنشاء القائمة'}
            </button>
          </div>
        </form>
      </div>

      {/* Checklist Display */}
      {checklist && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-in">
          <div className="bg-purple-50 p-4 md:p-6 border-b border-purple-100 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-purple-900">{checklist.areaName}</h3>
              <p className="text-purple-700 text-xs md:text-sm opacity-80">التركيز: {checklist.focusArea}</p>
            </div>
            <button 
                onClick={() => window.print()} 
                className="bg-white p-2 md:p-2.5 rounded-lg text-purple-600 hover:text-purple-700 shadow-sm border border-purple-100 active:bg-purple-50"
                title="طباعة"
            >
                <Printer size={20} />
            </button>
          </div>

          <div className="p-4 md:p-6 grid gap-6 md:gap-8">
            {checklist.categories.map((cat, catIdx) => (
              <div key={catIdx}>
                <h4 className="font-bold text-base md:text-lg text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 md:w-2 md:h-6 bg-purple-500 rounded-full"></span>
                    {cat.categoryName}
                </h4>
                <div className="space-y-3 mr-2 md:mr-4">
                  {cat.items.map((item, itemIdx) => {
                    const isChecked = checkedItems[`${catIdx}-${itemIdx}`];
                    return (
                      <div 
                        key={itemIdx}
                        onClick={() => toggleItem(catIdx.toString(), itemIdx)}
                        className={`
                            flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.99] md:active:scale-100
                            ${isChecked ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-purple-200'}
                        `}
                      >
                        <div className={`
                            w-7 h-7 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                            ${isChecked ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}
                        `}>
                            {isChecked && <CheckSquare size={16} />}
                        </div>
                        <span className={`flex-1 text-sm md:text-base leading-relaxed ${isChecked ? 'text-green-800 line-through opacity-70' : 'text-slate-700'}`}>
                            {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GembaWalkTool;
