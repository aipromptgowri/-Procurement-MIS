import React from 'react';
import { LayoutDashboard, FileText, Settings, Database, PieChart, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userRole: UserRole;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout, userName }) => {
  const isProc = userRole === 'procurement';
  const isFin = userRole === 'finance';

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        activeTab === id
          ? 'bg-[#ed2f39] text-white shadow-lg shadow-red-500/30'
          : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-[#F5F5F7] border-r border-gray-200 flex flex-col h-full fixed left-0 top-0 z-20">
      <div className="p-8 flex flex-col items-center border-b border-gray-200/50">
        <img 
          src="https://aaraainfrastructure.com/logo.png" 
          alt="AARAA Logo" 
          className="h-12 object-contain mb-2"
        />
        <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">Infrastructure</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {isProc && (
          <>
            <NavItem id="dashboard" icon={LayoutDashboard} label="Procurement DB" />
            <NavItem id="report" icon={FileText} label="MIS Reports" />
          </>
        )}

        {isFin && (
          <NavItem id="finance-dashboard" icon={PieChart} label="Accounts & Finance" />
        )}

        <NavItem id="data-entry" icon={Database} label="System Data" />
      </nav>

      <div className="p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="mb-4 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {userName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 capitalize truncate">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-[#ed2f39] hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;