import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  MessageSquareText, 
  X, 
  ChevronDown, 
  ChevronLeft,
  ScanEye,
  BrainCircuit,
  ClipboardList,
  FileSpreadsheet,
  ListChecks,
  Fish,
  RotateCw
} from 'lucide-react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

type NavItem = {
  id: ToolType;
  label: string;
  icon: React.ElementType;
};

type NavGroup = {
  title: string;
  key: string;
  items: NavItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool, isOpen, toggleSidebar }) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'analysis': true,
    'action': true,
    'vision': true
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navGroups: (NavItem | NavGroup)[] = [
    { 
      id: ToolType.DASHBOARD, 
      label: 'لوحة التحكم', 
      icon: LayoutDashboard 
    },
    {
      title: 'تحليل المشكلات',
      key: 'analysis',
      items: [
        { id: ToolType.A3_SOLVER, label: 'محلل A3 الذكي', icon: FileSpreadsheet },
        { id: ToolType.ISHIKAWA, label: 'مخطط إيشيكاوا', icon: Fish },
        { id: ToolType.FIVE_WHYS, label: 'تحليل 5 لماذا', icon: MessageSquareText },
      ]
    },
    {
        title: 'العمليات الميدانية',
        key: 'action',
        items: [
            { id: ToolType.KAIZEN, label: 'مُولّد الكايزن', icon: Lightbulb },
            { id: ToolType.PDCA, label: 'دورة PDCA', icon: RotateCw },
            { id: ToolType.GEMBA_WALK, label: 'مساعد الجيمبا', icon: ClipboardList },
            { id: ToolType.EIGHT_WASTES, label: 'تدقيق الهدر (8)', icon: ListChecks },
        ]
    },
    {
      title: 'الفحص البصري',
      key: 'vision',
      items: [
        { id: ToolType.WASTE_SCANNER, label: 'كاشف الهدر', icon: ScanEye },
      ]
    }
  ];

  const isActive = (id: ToolType) => activeTool === id;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed inset-y-0 right-0 z-40 w-72 max-w-[85vw] bg-slate-900 text-slate-100 transform transition-transform duration-300 ease-in-out border-l border-slate-800
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:relative md:translate-x-0 md:flex flex-col shadow-2xl
      `}>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-900/20 shrink-0">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">مساعد اللين</h1>
              <p className="text-xs text-slate-500 font-medium">LeanMaster AI</p>
            </div>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white transition-colors rounded-lg active:bg-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav Content */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {navGroups.map((group, idx) => {
            // Single Item
            if ('id' in group) {
              const item = group as NavItem;
              return (
                <div key={item.id} className="mb-6">
                    <button
                    onClick={() => {
                        onSelectTool(item.id);
                        if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group active:scale-[0.98] md:active:scale-100
                        ${isActive(item.id) 
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                    `}
                    >
                    <item.icon size={20} className={isActive(item.id) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                    <span className="font-medium text-sm">{item.label}</span>
                    </button>
                </div>
              );
            } 
            
            // Collapsible Group
            const navGroup = group as NavGroup;
            const isOpenGroup = openGroups[navGroup.key];
            
            return (
              <div key={navGroup.key} className="mb-4">
                <button
                  onClick={() => toggleGroup(navGroup.key)}
                  className="w-full flex items-center justify-between px-4 py-3 md:py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors mb-2"
                >
                  <span>{navGroup.title}</span>
                  {isOpenGroup ? <ChevronDown size={14} /> : <ChevronLeft size={14} className="rtl:rotate-180" />} 
                </button>
                
                <div className={`space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${isOpenGroup ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {navGroup.items.map(item => (
                     <button
                      key={item.id}
                      onClick={() => {
                        onSelectTool(item.id);
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group active:scale-[0.98] md:active:scale-100
                        ${isActive(item.id) 
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                      `}
                     >
                       <item.icon size={18} className={isActive(item.id) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                       <span className="font-medium text-sm">{item.label}</span>
                     </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
               <div className="relative">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
               </div>
               <div>
                 <p className="text-xs font-semibold text-slate-200">النظام متصل</p>
                 <p className="text-[10px] text-slate-500">v2.1.0 • Gemini 2.0</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;