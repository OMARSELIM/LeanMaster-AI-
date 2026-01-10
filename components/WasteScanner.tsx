import React, { useState, useRef } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { WasteAnalysis } from '../types';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertOctagon, XCircle, Loader2, Filter, Check, BrainCircuit, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const WasteScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setResult(null); // Clear previous result
        setFilterType('ALL');
        setFilterSeverity('ALL');
        addToast("تم تحميل الصورة بنجاح", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setResult(null); // Clear previous result to show skeleton
    try {
      // Extract base64 data without prefix for API
      const base64Data = image.split(',')[1];
      const analysis = await analyzeWasteImage(base64Data);
      setResult(analysis);
      setFilterType('ALL');
      setFilterSeverity('ALL');
      addToast("تم تحليل الصورة وتحديد الهدر بنجاح", "success");
    } catch (error) {
      console.error(error);
      addToast("حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.", "error");
    } finally {
      setLoading(false);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const uniqueTypes = result ? Array.from(new Set(result.detectedWastes.map(w => w.type))) : [];

  const filteredWastes = result?.detectedWastes.filter(waste => {
    const typeMatch = filterType === 'ALL' || waste.type === filterType;
    const severityMatch = filterSeverity === 'ALL' || waste.severity === filterSeverity;
    return typeMatch && severityMatch;
  }) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">كاشف الهدر (مودا)</h2>
        <p className="text-slate-500 mt-2">ارفع صورة لمكان العمل، وسيقوم الذكاء الاصطناعي بتحديد الهدر وانتهاكات الـ 5S</p>
      </header>

      {/* Progress Tracker */}
      <div className="max-w-2xl mx-auto mb-8 px-4" dir="rtl">
        <div className="relative flex items-center justify-between">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 -z-10 rounded-full"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-1/2 right-0 h-1 bg-teal-500 transition-all duration-700 ease-in-out -translate-y-1/2 -z-10 rounded-full"
            style={{ width: result ? '100%' : (image || loading) ? '50%' : '0%' }}
          ></div>

          {/* Step 1: Upload */}
          <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
              ${image ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-teal-500 text-teal-600 shadow-md scale-110'}
            `}>
              {image ? <Check size={20} strokeWidth={3} /> : <UploadCloud size={20} />}
            </div>
            <span className={`text-xs font-bold ${image ? 'text-teal-700' : 'text-slate-800'}`}>رفع الصورة</span>
          </div>

          {/* Step 2: Analyze */}
          <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
              ${result ? 'bg-teal-500 border-teal-500 text-white' : 
                loading ? 'bg-white border-teal-500 text-teal-600 shadow-md scale-110' : 
                image ? 'bg-white border-teal-500 text-teal-600' : 
                'bg-slate-100 border-slate-200 text-slate-400'}
            `}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : result ? <Check size={20} strokeWidth={3} /> : <BrainCircuit size={20} />}
            </div>
            <span className={`text-xs font-bold ${result || loading || image ? 'text-slate-800' : 'text-slate-400'}`}>التحليل</span>
          </div>

          {/* Step 3: Results */}
          <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
              ${result ? 'bg-white border-teal-500 text-teal-600 shadow-md scale-110' : 'bg-slate-100 border-slate-200 text-slate-400'}
            `}>
              <FileText size={20} />
            </div>
            <span className={`text-xs font-bold ${result ? 'text-slate-800' : 'text-slate-400'}`}>النتائج</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upload Section */}
        <div className="space-y-6">
          <div 
            onClick={triggerUpload}
            className={`
              relative w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
              ${image ? 'border-teal-500 bg-slate-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'}
            `}
          >
            {image ? (
              <img src={image} alt="Workspace" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <p className="font-semibold text-slate-700">اضغط لرفع صورة</p>
                <p className="text-sm text-slate-400 mt-1">JPG, PNG up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            {image && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-semibold flex items-center gap-2">
                  <ImageIcon size={20} /> تغيير الصورة
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
               <>
                 <Loader2 className="animate-spin" />
                 جاري تحليل الصورة...
               </>
            ) : 'ابدأ التحليل'}
          </button>
        </div>

        {/* Right: Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
          {loading ? (
            <div className="h-full space-y-6 animate-pulse">
               {/* Skeleton Header */}
               <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
                  <div className="flex gap-2 items-center">
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                    <div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
                  </div>
               </div>

               {/* Skeleton Summary */}
               <div className="p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                  <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
               </div>

               {/* Skeleton Filter Bar */}
               <div className="flex justify-between items-center">
                  <div className="h-4 w-40 bg-slate-200 rounded"></div>
                  <div className="h-8 w-48 bg-slate-100 rounded-lg"></div>
               </div>

               {/* Skeleton Cards */}
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-slate-100 p-4 rounded-xl space-y-3">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                             <div className="h-5 w-24 bg-slate-200 rounded"></div>
                          </div>
                          <div className="h-5 w-16 bg-slate-200 rounded"></div>
                       </div>
                       <div className="h-3 w-full bg-slate-100 rounded"></div>
                       <div className="h-10 w-full bg-slate-50 rounded-lg"></div>
                    </div>
                  ))}
               </div>
            </div>
          ) : !result ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <AlertOctagon size={40} className="opacity-20" />
              </div>
              <p>النتائج ستظهر هنا بعد التحليل</p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-xl text-slate-800">نتائج الفحص</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">نتيجة الـ 5S:</span>
                  <span className={`text-xl font-black ${
                    result.overallScore > 80 ? 'text-green-500' : result.overallScore > 50 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {result.overallScore}/100
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
                <p className="font-semibold mb-1">الملخص التنفيذي:</p>
                {result.summary}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="font-bold text-slate-800">أنواع الهدر المكتشفة:</p>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <Filter size={14} className="text-slate-400 ml-1" />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">كل الأنواع</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <select 
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">كل المستويات</option>
                        <option value="High">مرتفع</option>
                        <option value="Medium">متوسط</option>
                        <option value="Low">منخفض</option>
                    </select>
                  </div>
                </div>

                {filteredWastes.length > 0 ? (
                  filteredWastes.map((waste, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-shadow animate-fade-in">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <XCircle size={18} className="text-red-500" />
                          <h4 className="font-bold text-slate-800">{waste.type}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(waste.severity)}`}>
                          {waste.severity === 'High' ? 'خطير' : waste.severity === 'Medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{waste.description}</p>
                      <div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg text-sm text-green-800">
                        <CheckCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{waste.recommendation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Filter size={24} className="mx-auto mb-2 opacity-50" />
                    <p>لا توجد نتائج تطابق معايير التصفية</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteScanner;