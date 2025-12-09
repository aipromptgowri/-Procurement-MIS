import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FinanceDashboard from './components/FinanceDashboard';
import ReportGenerator from './components/ReportGenerator';
import DataEditor from './components/DataEditor';
import Login from './components/Login';
import { fetchWeeklyData, saveWeeklyData, checkDbConnection } from './services/dataService';
import { CURRENT_WEEK_DATA } from './constants';
import { WeeklyData, User } from './types';
import { Pencil, Loader2, LogOut, Database, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [data, setData] = useState<WeeklyData>(CURRENT_WEEK_DATA);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Check connection first
      const isConnected = await checkDbConnection();
      setDbConnected(isConnected);
      
      // Then fetch data
      const fetchedData = await fetchWeeklyData();
      setData(fetchedData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
      // Set default tab based on role when user logs in
      if (user) {
          if (user.role === 'finance') {
              setActiveTab('finance-dashboard');
          } else {
              setActiveTab('dashboard');
          }
      }
  }, [user]);

  const handleSaveData = async (newData: WeeklyData) => {
     await saveWeeklyData(newData);
     setData(newData);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-[#ed2f39] animate-spin" />
          <p className="text-gray-500 font-medium">Loading System Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-gray-900">
      {/* Navigation (Bottom on Mobile, Left on Desktop) */}
      <div className="print:hidden">
        <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userRole={user.role} 
            onLogout={handleLogout}
            userName={user.name}
        />
      </div>

      {/* Main Content Area */}
      <div className="
        /* Mobile: Bottom Nav Spacing */
        pb-28 px-4 pt-4
        /* Desktop: Left Sidebar Spacing */
        md:ml-64 md:p-8 md:pb-8
        print:ml-0 print:p-0
      ">
        <header className="mb-6 md:mb-8 flex justify-between items-center print:hidden animate-fade-in-down">
          
          {/* Mobile Header Left: Logo + Brand */}
          <div className="flex items-center gap-3 md:hidden">
            <img src="https://aaraainfrastructure.com/logo.png" alt="AARAA" className="h-8 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">AARAA</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider">INFRASTRUCTURE</p>
            </div>
          </div>

          {/* Desktop Header Left: Page Titles */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Procurement Overview' : 
               activeTab === 'finance-dashboard' ? 'Financial Control Center' :
               activeTab === 'report' ? 'Weekly MIS Reports' : 'System Administration'}
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              {activeTab === 'data-entry' 
                ? 'Manage system records and weekly inputs.'
                : `Hello ${user.name.split(' ')[0]}, here's your weekly summary.`}
            </p>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
             
             {/* DB Status Indicator */}
             <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm text-xs font-semibold ${
               dbConnected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'
             }`}>
                {dbConnected ? <Database size={14} /> : <WifiOff size={14} />}
                {dbConnected ? 'Online' : 'Local Mode'}
             </div>

             <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-500">
                  Week of: <span className="text-gray-900 font-bold">{data.weekStarting}</span>
                </span>
             </div>

             {/* Mobile: Week Badge (Small) */}
             <div className="md:hidden flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-900">{data.weekStarting.split(',')[0]}</span>
             </div>

             {user.role === 'procurement' && activeTab !== 'data-entry' && (
                 <button 
                  onClick={() => setActiveTab('data-entry')}
                  className="bg-white p-2 rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-[#ed2f39] transition-colors"
                  title="Quick Edit"
                 >
                   <Pencil size={18} />
                 </button>
             )}

             {/* Mobile Logout Button (Visible only on mobile) */}
             <button 
               onClick={handleLogout}
               className="md:hidden bg-white p-2 rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-red-600 transition-colors"
               title="Sign Out"
             >
               <LogOut size={18} />
             </button>
          </div>
        </header>

        {/* Mobile Page Title (Below header for layout balance) */}
        <div className="mb-6 md:hidden flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-900">
               {activeTab === 'dashboard' ? 'Overview' : 
                activeTab === 'finance-dashboard' ? 'Finance' :
                activeTab === 'report' ? 'Reports' : 'System Data'}
             </h2>
             
             {/* Mobile DB Status */}
             <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                dbConnected ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
             }`}>
                {dbConnected ? <Database size={16} /> : <WifiOff size={16} />}
             </div>
        </div>

        <main className="animate-fade-in-up">
          {activeTab === 'dashboard' && user.role === 'procurement' && (
            <Dashboard data={data} />
          )}
          {activeTab === 'finance-dashboard' && user.role === 'finance' && (
            <FinanceDashboard data={data} />
          )}
          {activeTab === 'report' && user.role === 'procurement' && (
            <ReportGenerator data={data} />
          )}
          {activeTab === 'data-entry' && (
            <DataEditor data={data} onSave={handleSaveData} userRole={user.role} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;