import React, { useState, useRef, useEffect } from 'react';
import { continueFiveWhys, improveText } from '../services/geminiService';
import { Send, User, Bot, RotateCcw, Wand2, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FiveWhysSession: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك. أنا مساعدك لتحليل الأسباب الجذرية. أخبرني بالمشكلة لنبدأ جلسة "الخمسة لماذا".' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Convert history for API
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));

      const reply = await continueFiveWhys(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error(error);
      addToast("فشل الاتصال بالخادم", "error");
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ. حاول مرة أخرى." }]);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setMessages([{ role: 'model', text: 'أهلاً بك. أنا مساعدك لتحليل الأسباب الجذرية. أخبرني بالمشكلة لنبدأ جلسة "الخمسة لماذا".' }]);
    setInput('');
    addToast("تم بدء جلسة جديدة", "info");
  };

  const handleFix = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission
    if (!input.trim()) return;

    setIsFixing(true);
    try {
      const corrected = await improveText(input);
      if (corrected !== input) {
        setInput(corrected);
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
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-800 text-sm md:text-base">جلسة الخمسة لماذا (5 Whys)</h2>
          <p className="text-[10px] md:text-xs text-slate-500">حوار تفاعلي للوصول للجذور</p>
        </div>
        <button onClick={resetSession} className="text-slate-400 hover:text-teal-600 transition-colors p-2" title="جلسة جديدة">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-in`}>
            <div className={`
              w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'}
            `}>
              {msg.role === 'user' ? <User size={14} className="md:w-4 md:h-4" /> : <Bot size={14} className="md:w-4 md:h-4" />}
            </div>
            <div className={`
              max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 md:gap-3 animate-slide-in">
             <div className="w-7 h-7 md:w-8 md:h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center shrink-0">
                <Bot size={14} />
             </div>
             <div className="bg-slate-100 p-3 md:p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 md:p-4 bg-white border-t border-slate-100 flex gap-2 items-end">
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="اكتب ردك هنا..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none min-h-[50px] max-h-[120px]"
            rows={1}
            spellCheck="true"
            lang="ar"
            style={{ minHeight: '48px' }}
          />
          {input.trim() && (
            <button
              onClick={handleFix}
              type="button"
              disabled={isFixing}
              className="absolute left-2 bottom-3 text-slate-400 hover:text-indigo-600 transition-colors p-1"
              title="تصحيح النص"
            >
              {isFixing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            </button>
          )}
        </div>
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 h-[48px] w-[48px] flex items-center justify-center"
        >
          <Send size={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
        </button>
      </form>
    </div>
  );
};

export default FiveWhysSession;
