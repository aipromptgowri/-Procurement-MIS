import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ReportGenerator from './components/ReportGenerator';
import DataEditor from './components/DataEditor';
import { CURRENT_WEEK_DATA } from './constants';
import { WeeklyData } from './types';
import { Pencil } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'data-entry'>('dashboard');
  const [data, setData] = useState<WeeklyData>(CURRENT_WEEK_DATA);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Hidden on print */}
      <div className="print:hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 print:ml-0 print:p-0">
        {/* Header - Hidden on print if we are in dashboard/editor, but for report view, handled inside component */}
        <header className="mb-8 flex justify-between items-center print:hidden">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' ? 'Procurement Overview' : 
               activeTab === 'report' ? 'Weekly Reports' : 'System Administration'}
            </h2>
            <p className="text-gray-500">
              {activeTab === 'data-entry' 
                ? 'Update weekly figures and project statuses.'
                : "Welcome back, here's what's happening at AARAA INFRA this week."}
            </p>
          </div>
          <div className="text-right flex items-center gap-2">
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-500">
                  Week Starting: <span className="text-gray-800">{data.weekStarting}</span>
                </span>
                <button 
                  onClick={() => setActiveTab('data-entry')}
                  className="p-1 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
                  title="Edit Data"
                >
                  <Pencil size={14} />
                </button>
             </div>
          </div>
        </header>

        <main>
          {activeTab === 'dashboard' && (
            <Dashboard data={data} />
          )}
          {activeTab === 'report' && (
            <ReportGenerator data={data} />
          )}
          {activeTab === 'data-entry' && (
            <DataEditor data={data} onSave={setData} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;