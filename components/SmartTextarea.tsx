import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { improveText } from '../services/geminiService';
import { useToast } from '../context/ToastContext';

interface SmartTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange: (value: string) => void;
  value: string;
}

const SmartTextarea: React.FC<SmartTextareaProps> = ({ value, onValueChange, className, ...props }) => {
  const [isFixing, setIsFixing] = useState(false);
  const { addToast } = useToast();

  const handleFix = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!value || !value.trim()) return;

    setIsFixing(true);
    try {
      const corrected = await improveText(value);
      if (corrected !== value) {
        onValueChange(corrected);
        addToast("تم تصحيح النص بنجاح", "success");
      } else {
        addToast("النص يبدو جيداً بالفعل", "info");
      }
    } catch (error) {
      addToast("فشل في تصحيح النص", "error");
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="relative group">
      <textarea
        {...props}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`${className} pb-12`}
        spellCheck="true"
        lang="ar"
      />
      <div className="absolute bottom-2 left-2 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
        <button
          onClick={handleFix}
          disabled={isFixing || !value.trim()}
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors shadow-sm border border-indigo-200 disabled:opacity-50 touch-manipulation"
          title="تدقيق لغوي وتصحيح تلقائي"
        >
          {isFixing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Wand2 size={16} />
          )}
          <span>تحسين النص</span>
        </button>
      </div>
    </div>
  );
};

export default SmartTextarea;