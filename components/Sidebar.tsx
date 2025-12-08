import React from 'react';
import { LayoutDashboard, FileText, Settings, Building2, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'report' | 'data-entry';
  setActiveTab: (tab: 'dashboard' | 'report' | 'data-entry') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
           <Building2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">AARAA INFRA</h1>
          <p className="text-xs text-slate-400">Procurement Suite</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </button>
        
        <button
          onClick={() => setActiveTab('report')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'report'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FileText size={20} />
          <span className="font-medium">MIS Report</span>
        </button>

        <button
          onClick={() => setActiveTab('data-entry')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'data-entry'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Database size={20} />
          <span className="font-medium">Data Entry</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div>
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-slate-500">Sr. Procurement Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;