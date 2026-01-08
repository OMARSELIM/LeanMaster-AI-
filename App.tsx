import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KaizenGenerator from './components/KaizenGenerator';
import FiveWhysSession from './components/FiveWhysSession';
import WasteScanner from './components/WasteScanner';
import { ToolType } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h1 className="font-bold text-lg text-slate-800">مساعد اللين</h1>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderTool()}
        </main>
      </div>
    </div>
  );
};

export default App;