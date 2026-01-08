import React, { useState, useRef } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { WasteAnalysis } from '../types';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertOctagon, XCircle, Loader2 } from 'lucide-react';

const WasteScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      // Extract base64 data without prefix for API
      const base64Data = image.split(',')[1];
      const analysis = await analyzeWasteImage(base64Data);
      setResult(analysis);
    } catch (error) {
      alert("حدث خطأ أثناء تحليل الصورة.");
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">كاشف الهدر (مودا)</h2>
        <p className="text-slate-500 mt-2">ارفع صورة لمكان العمل، وسيقوم الذكاء الاصطناعي بتحديد الهدر وانتهاكات الـ 5S</p>
      </header>

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
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <AlertOctagon size={40} className="opacity-20" />
              </div>
              <p>النتائج ستظهر هنا بعد التحليل</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
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
                <p className="font-bold text-slate-800">أنواع الهدر المكتشفة:</p>
                {result.detectedWastes.map((waste, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-shadow">
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteScanner;