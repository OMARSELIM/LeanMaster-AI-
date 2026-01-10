import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KaizenGenerator from './components/KaizenGenerator';
import FiveWhysSession from './components/FiveWhysSession';
import WasteScanner from './components/WasteScanner';
import GembaWalkTool from './components/GembaWalkTool';
import A3Solver from './components/A3Solver';
import EightWastesAudit from './components/EightWastesAudit';
import IshikawaDiagram from './components/IshikawaDiagram';
import PDCATracker from './components/PDCATracker';
import { ToolType } from './types';
import { Menu, BrainCircuit } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';

const AppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.DASHBOARD:
        return <Dashboard />;
      case ToolType.KAIZEN:
        return <KaizenGenerator />;
      case ToolType.FIVE_WHYS:
        return <FiveWhysSession />;
      case ToolType.WASTE_SCANNER:
        return <WasteScanner />;
      case ToolType.GEMBA_WALK:
        return <GembaWalkTool />;
      case ToolType.A3_SOLVER:
        return <A3Solver />;
      case ToolType.EIGHT_WASTES:
        return <EightWastesAudit />;
      case ToolType.ISHIKAWA:
        return <IshikawaDiagram />;
      case ToolType.PDCA:
        return <PDCATracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTool={activeTool} 
        onSelectTool={setActiveTool} 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                  <BrainCircuit size={18} />
               </div>
               <h1 className="font-bold text-lg text-slate-800">مساعد اللين</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 -mr-2 text-slate-600 hover:bg-slate-50 rounded-lg active:bg-slate-100"
            >
                <Menu size={24} />
            </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {renderTool()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;