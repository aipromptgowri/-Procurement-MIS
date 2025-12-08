import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FinanceDashboard from './components/FinanceDashboard';
import ReportGenerator from './components/ReportGenerator';
import DataEditor from './components/DataEditor';
import Login from './components/Login';
import { fetchWeeklyData, saveWeeklyData } from './services/dataService';
import { CURRENT_WEEK_DATA } from './constants';
import { WeeklyData, User } from './types';
import { Pencil, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [data, setData] = useState<WeeklyData>(CURRENT_WEEK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
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
    <div className="min-h-screen bg-[#F5F5F7] flex font-sans text-gray-900">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userRole={user.role} 
            onLogout={handleLogout}
            userName={user.name}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 print:ml-0 print:p-0">
        <header className="mb-8 flex justify-between items-center print:hidden animate-fade-in-down">
          <div>
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
          <div className="text-right flex items-center gap-3">
             <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-500">
                  Week of: <span className="text-gray-900 font-bold">{data.weekStarting}</span>
                </span>
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
          </div>
        </header>

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