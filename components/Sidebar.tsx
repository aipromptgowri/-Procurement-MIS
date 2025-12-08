import React from 'react';
import { LayoutDashboard, FileText, Database, PieChart, LogOut } from 'lucide-react';
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
      className={`
        group flex items-center transition-all duration-200
        /* Mobile Styles */
        flex-col justify-center p-2 rounded-xl gap-1 w-full
        /* Desktop Styles */
        md:flex-row md:justify-start md:px-4 md:py-3 md:gap-3 md:w-full
        ${
          activeTab === id
            ? 'text-[#ed2f39] md:bg-[#ed2f39] md:text-white md:shadow-lg md:shadow-red-500/30'
            : 'text-gray-400 hover:text-gray-600 md:hover:bg-white md:hover:text-gray-900 md:hover:shadow-sm'
        }
      `}
    >
      <Icon 
        className={`
          w-6 h-6 md:w-5 md:h-5
          ${activeTab === id ? 'text-[#ed2f39] md:text-white' : 'text-gray-400 group-hover:text-gray-600'}
        `} 
      />
      <span className={`
        text-[10px] font-medium md:text-sm
        ${activeTab === id ? 'font-bold' : ''}
      `}>
        {label}
      </span>
    </button>
  );

  return (
    <>
      {/* Container: Bottom Fixed (Mobile) / Left Fixed (Desktop) */}
      <div className="
        fixed z-50 bg-[#F5F5F7] border-gray-200 transition-all
        
        /* Mobile: Bottom Bar */
        bottom-0 left-0 w-full h-[88px] border-t bg-white/90 backdrop-blur-xl flex flex-row justify-between items-center px-2 pb-5 pt-2
        
        /* Desktop: Left Sidebar */
        md:top-0 md:h-full md:w-64 md:flex-col md:border-r md:bg-[#F5F5F7] md:pb-0 md:pt-0 md:px-0 md:items-stretch
      ">
        
        {/* Logo Section - Desktop Only */}
        <div className="hidden md:flex p-8 flex-col items-center border-b border-gray-200/50">
          <img 
            src="https://aaraainfrastructure.com/logo.png" 
            alt="AARAA Logo" 
            className="h-12 object-contain mb-2"
          />
          <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">Infrastructure</p>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 w-full flex flex-row md:flex-col md:p-4 md:space-y-2 justify-around md:justify-start md:overflow-y-auto">
          {isProc && (
            <>
              <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem id="report" icon={FileText} label="Reports" />
            </>
          )}

          {isFin && (
            <NavItem id="finance-dashboard" icon={PieChart} label="Finance" />
          )}

          <NavItem id="data-entry" icon={Database} label="Data" />
        </nav>

        {/* User Section - Desktop Only */}
        <div className="hidden md:block p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
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
    </>
  );
};

export default Sidebar;