import React, { useState } from 'react';
import { generateEightWastesReport } from '../services/geminiService';
import { EightWastesReport } from '../types';
import { ClipboardList, ArrowLeft, ArrowRight, Loader2, Save, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SmartTextarea from './SmartTextarea';

const wastes = [
  { id: 'defects', letter: 'D', name: 'العيوب (Defects)', description: 'منتجات أو خدمات لا تطابق المواصفات وتحتاج لإعادة عمل أو تصبح خردة.' },
  { id: 'overproduction', letter: 'O', name: 'الإنتاج الزائد (Overproduction)', description: 'إنتاج أكثر من الحاجة، أو قبل وقت الحاجة الفعلي.' },
  { id: 'waiting', letter: 'W', name: 'الانتظار (Waiting)', description: 'وقت ضائع في انتظار مواد، معلومات، موافقات، أو معدات.' },
  { id: 'nonUtilizedTalent', letter: 'N', name: 'المواهب غير المستغلة (Non-Utilized Talent)', description: 'عدم استثمار مهارات، أفكار، وإبداعات الموظفين في التحسين.' },
  { id: 'transportation', letter: 'T', name: 'النقل (Transportation)', description: 'حركة غير ضرورية للمواد أو المنتجات لا تضيف قيمة للمنتج.' },
  { id: 'inventory', letter: 'I', name: 'المخزون (Inventory)', description: 'تخزين مواد خام، أو أعمال قيد التنفيذ، أو منتجات نهائية تزيد عن الحاجة.' },
  { id: 'motion', letter: 'M', name: 'الحركة (Motion)', description: 'حركة الأفراد أو المعدات التي لا تضيف قيمة وتسبب الإجهاد.' },
  { id: 'extraProcessing', letter: 'E', name: 'المعالجة الزائدة (Extra-Processing)', description: 'القيام بخطوات عمل إضافية أو تدقيق لا يطلبه العميل.' },
];

const EightWastesAudit: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<EightWastesReport | null>(null);
  const { addToast } = useToast();

  const handleInputChange = (value: string) => {
    setObservations(prev => ({
      ...prev,
      [wastes[activeStep].id]: value
    }));
  };

  const nextStep = () => {
    if (activeStep < wastes.length - 1) setActiveStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Filter out empty observations
    const validObservations: Record<string, string> = {};
    let hasData = false;
    Object.entries(observations).forEach(([key, value]) => {
      // Explicitly cast value to string to resolve TS error where it might be inferred as unknown
      const strValue = value as string;
      if (strValue.trim()) {
        validObservations[key] = strValue;
        hasData = true;
      }
    });

    if (!hasData) {
      addToast("يرجى إدخال ملاحظة واحدة على الأقل قبل التحليل", "error");
      return;
    }

    setLoading(true);
    setReport(null);
    try {
      const result = await generateEightWastesReport(validObservations);
      setReport(result);
      addToast("تم إنشاء تقرير التدقيق بنجاح", "success");
    } catch (error) {
      addToast("حدث خطأ أثناء تحليل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  if (report) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-in">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div>
             <h2 className="text-2xl font-bold text-slate-800">تقرير تدقيق الهدر الثمانية</h2>
             <p className="text-slate-500">تحليل شامل لنقاط الهدر والتحسين</p>
           </div>
           <div className="flex gap-4 items-center">
             <div className="text-center">
                <span className="block text-xs text-slate-500 font-bold uppercase">نقاط الصحة</span>
                <span className={`text-3xl font-black ${
                    report.overallHealthScore > 80 ? 'text-green-500' : report.overallHealthScore > 50 ? 'text-amber-500' : 'text-red-500'
                }`}>{report.overallHealthScore}%</span>
             </div>
             <button 
               onClick={() => setReport(null)}
               className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
             >
               تدقيق جديد
             </button>
           </div>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4 text-slate-800">الملخص التنفيذي</h3>
          <p className="text-slate-700 leading-relaxed">{report.executiveSummary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.wasteBreakdown.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <h4 className="font-bold text-lg text-slate-800">{item.wasteType}</h4>
                 <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.priority === 'High' ? 'bg-red-100 text-red-700' : 
                    item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                 }`}>
                   {item.priority === 'High' ? 'أولوية عالية' : item.priority === 'Medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'}
                 </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 flex-1">{item.analysis}</p>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">إجراءات التحسين المقترحة:</p>
                <ul className="space-y-2">
                  {item.actionItems.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentWaste = wastes[activeStep];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <header className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <ClipboardList className="text-indigo-500" size={32} />
          <span>مدقق الهدر الثمانية</span>
        </h2>
        <p className="text-slate-500">قم بتسجيل ملاحظاتك حول أنواع الهدر الثمانية (DOWNTIME) للحصول على خطة تحسين.</p>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${((activeStep + 1) / wastes.length) * 100}%` }}
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
        {/* Card Header */}
        <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-600/20">
             {currentWaste.letter}
           </div>
           <div>
             <h3 className="text-xl font-bold text-indigo-900">{currentWaste.name}</h3>
             <p className="text-indigo-700/80 text-sm mt-1">{currentWaste.description}</p>
           </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            سجل ملاحظاتك حول هذا الهدر في موقع العمل:
          </label>
          <SmartTextarea
            value={observations[currentWaste.id] || ''}
            onValueChange={handleInputChange}
            placeholder={`هل تلاحظ أي ${currentWaste.name}؟ صف الحالة هنا...`}
            className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all min-h-[150px]"
          />
          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-400">
               {observations[currentWaste.id] ? 'تم تسجيل الملاحظة' : 'لا توجد ملاحظات مسجلة'}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
           <button
             onClick={prevStep}
             disabled={activeStep === 0}
             className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
           >
             <ArrowRight size={18} className="rtl:rotate-180" />
             <span>السابق</span>
           </button>

           <span className="text-sm font-bold text-slate-400">
             {activeStep + 1} / {wastes.length}
           </span>

           {activeStep === wastes.length - 1 ? (
             <button
               onClick={handleSubmit}
               disabled={loading}
               className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-70"
             >
               {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
               <span>إنشاء التقرير</span>
             </button>
           ) : (
             <button
               onClick={nextStep}
               className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-all"
             >
               <span>التالي</span>
               <ArrowLeft size={18} className="rtl:rotate-180" />
             </button>
           )}
        </div>
      </div>

      {/* Steps Indicators */}
      <div className="flex justify-center gap-2 flex-wrap">
        {wastes.map((w, idx) => (
          <button
            key={w.id}
            onClick={() => setActiveStep(idx)}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${activeStep === idx 
                ? 'bg-indigo-600 text-white scale-110 shadow-md' 
                : observations[w.id] 
                  ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'}
            `}
          >
            {w.letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EightWastesAudit;
