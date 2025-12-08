import React from 'react';
import { WeeklyData, InvoiceStatus } from '../types';
import StatCard from './StatCard';
import { DollarSign, AlertCircle, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface FinanceDashboardProps {
  data: WeeklyData;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ data }) => {
  const finance = data.finance;
  const formatCurrency = (val: number) => `₹${(val/100000).toFixed(2)} L`;

  const cashFlowData = [
    { name: 'Payables', value: finance.totalOutstandingPayables },
    { name: 'Cash Req', value: finance.weeklyCashFlowReq },
    { name: 'Overdue', value: finance.overduePayables },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Outstanding Payables"
          value={`₹${(finance.totalOutstandingPayables / 100000).toFixed(2)} L`}
          icon={<DollarSign size={20} />}
          trend="down"
          trendValue="On Track"
        />
        <StatCard
          title="Weekly Cash Req."
          value={`₹${(finance.weeklyCashFlowReq / 100000).toFixed(2)} L`}
          icon={<TrendingUp size={20} />}
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Overdue Invoices"
          value={`₹${(finance.overduePayables / 100000).toFixed(2)} L`}
          subValue="Immediate Action"
          icon={<AlertCircle size={20} />}
          trend="down"
          trendValue="Critical"
        />
        <StatCard
          title="Budget Utilized"
          value={`${finance.budgetUtilizedTotal}%`}
          icon={<CreditCard size={20} />}
          trend="neutral"
          trendValue="Avg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(val) => `₹${val/100000}L`} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  formatter={(value: number) => `₹${(value).toLocaleString('en-IN')}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                   {cashFlowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#ed2f39' : '#10b981'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="bg-[#1c1c1e] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
           <div>
             <h3 className="text-xl font-bold mb-2">Finance Actions</h3>
             <p className="text-gray-400 text-sm mb-6">Pending approvals for high-value payments this week.</p>
             
             <div className="space-y-4">
               <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                 <div className="w-10 h-10 rounded-full bg-[#ed2f39] flex items-center justify-center flex-shrink-0">
                   <AlertCircle size={20} />
                 </div>
                 <div>
                   <p className="font-medium text-sm">Approve Tata Steel Payment</p>
                   <p className="text-xs text-gray-400">Due: Tomorrow</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                 <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                   <Calendar size={20} />
                 </div>
                 <div>
                   <p className="font-medium text-sm">Review Monthly Budget</p>
                   <p className="text-xs text-gray-400">Due: Friday</p>
                 </div>
               </div>
             </div>
           </div>
           
           <button className="w-full py-3 bg-white text-black font-semibold rounded-xl mt-6 hover:bg-gray-100 transition-colors">
             View All Actions
           </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h3 className="text-lg font-bold text-gray-900">Recent Invoices</h3>
           <button className="text-[#ed2f39] text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F5F5F7] text-gray-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">PO Ref</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {finance.recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.id}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.vendorName}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{inv.poNumber}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === InvoiceStatus.PAID ? 'bg-green-100 text-green-800' :
                      inv.status === InvoiceStatus.OVERDUE ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;