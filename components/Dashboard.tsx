import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { WeeklyData } from '../types';
import StatCard from './StatCard';
import { DollarSign, ShoppingCart, Truck, AlertTriangle, Clock } from 'lucide-react';

interface DashboardProps {
  data: WeeklyData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const projectChartData = data.projects.map(p => ({
    name: p.name.split(' ')[0], // Short name
    utilization: p.budgetUtilization,
    pos: p.posRaisedCount
  }));

  const materialChartData = data.topMaterials.map(m => ({
    name: m.name,
    value: m.value
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total PO Value"
          value={`₹${(data.totalPOValue / 10000000).toFixed(2)} Cr`}
          icon={<DollarSign size={20} />}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="POs Raised"
          value={data.totalPOsRaised}
          icon={<ShoppingCart size={20} />}
          trend="up"
          trendValue="+5"
        />
        <StatCard
          title="Deliveries Completed"
          value={data.deliveriesCompleted}
          subValue={`Delayed: ${data.deliveriesDelayed}`}
          icon={<Truck size={20} />}
          trend="down"
          trendValue="-2"
        />
        <StatCard
          title="Pending Approvals"
          value={data.pendingApprovals}
          icon={<Clock size={20} />}
          trend="down"
          trendValue="-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Budget Utilization */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Budget Utilization</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis unit="%" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="utilization" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Budget %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Materials Spend */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Materials (Spend)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {materialChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${(value / 100000).toFixed(1)} L`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Shortages Alert */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Critical Material Shortages</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.projects.filter(p => p.criticalShortages.length > 0).map(project => (
            <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">{project.name}</h4>
              <ul className="space-y-1">
                {project.criticalShortages.map((item, idx) => (
                  <li key={idx} className="text-sm text-red-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;