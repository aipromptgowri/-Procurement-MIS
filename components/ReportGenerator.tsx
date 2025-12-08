import React, { useState } from 'react';
import { WeeklyData, GeneratedReportSections, POStatus, VendorRating } from '../types';
import { generateReportNarrative } from '../services/geminiService';
import { FileText, Printer, Sparkles, AlertCircle, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface ReportGeneratorProps {
  data: WeeklyData;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data }) => {
  const [reportNarrative, setReportNarrative] = useState<GeneratedReportSections | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const narrative = await generateReportNarrative(data);
      setReportNarrative(narrative);
    } catch (err) {
      setError("Failed to generate report narrative. Please ensure API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  if (!reportNarrative) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-xl border border-dashed border-gray-300">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <FileText size={48} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Weekly MIS Report</h2>
        <p className="text-gray-500 max-w-md text-center mb-8">
          Generate a comprehensive, AI-enhanced report for the week starting {data.weekStarting}.
          This will analyze data, identify risks, and summarize vendor performance.
        </p>
        
        {loading ? (
          <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-lg text-gray-500 cursor-wait">
            <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
            Analyzing {data.projects.length} projects and {data.totalPOsRaised} POs...
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-200"
          >
            <Sparkles size={18} />
            Generate Weekly Report
          </button>
        )}
        
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden report-container">
      {/* Report Header */}
      <div className="p-8 border-b border-gray-200 bg-slate-900 text-white flex justify-between items-center print-only">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">AARAA INFRA</h1>
          <p className="text-slate-400 text-sm mt-1">PROCUREMENT DEPARTMENT</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Weekly MIS Report</h2>
          <p className="text-slate-400 text-sm mt-1">Week of: {data.weekStarting}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Printer size={18} />
          Print / Save PDF
        </button>
      </div>

      {/* Report Content */}
      <div className="p-8 max-w-5xl mx-auto space-y-8 report-scroll text-sm md:text-base">
        
        {/* 1. Executive Summary */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <div className="bg-slate-50 p-6 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
            {reportNarrative.executiveSummary}
          </div>
        </section>

        {/* 2. Procurement KPIs */}
        <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            2. Procurement KPIs (Weekly)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Total POs Raised</span>
              <span className="block text-xl font-bold text-gray-900 mt-1">{data.totalPOsRaised}</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Total PO Value</span>
              <span className="block text-xl font-bold text-gray-900 mt-1">{formatCurrency(data.totalPOValue)}</span>
            </div>
             <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Deliveries Completed</span>
              <span className="block text-xl font-bold text-green-600 mt-1">{data.deliveriesCompleted}</span>
            </div>
             <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Pending Approvals</span>
              <span className="block text-xl font-bold text-orange-600 mt-1">{data.pendingApprovals}</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Pending Indents</span>
              <span className="block text-xl font-bold text-gray-700 mt-1">{data.pendingIndentsCount}</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Indent Value</span>
              <span className="block text-xl font-bold text-gray-700 mt-1">{formatCurrency(data.pendingIndentsValue)}</span>
            </div>
             <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <span className="block text-xs text-gray-500 uppercase font-semibold">Deliveries Delayed</span>
              <span className="block text-xl font-bold text-red-600 mt-1">{data.deliveriesDelayed}</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
             <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Top 5 Materials Procured</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {data.topMaterials.map((mat, idx) => (
                   <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                         <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                         <span className="text-gray-700">{mat.name}</span>
                      </div>
                      <span className="font-mono text-gray-900 font-medium">{formatCurrency(mat.value)}</span>
                   </div>
                ))}
             </div>
          </div>
        </section>

        {/* 3. Project-wise Status */}
        <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            3. Project-wise Procurement Status
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 border-b">Project</th>
                  <th className="px-4 py-3 border-b text-center">Reqs Recv</th>
                  <th className="px-4 py-3 border-b text-center">POs Raised</th>
                  <th className="px-4 py-3 border-b text-center">Delivered</th>
                  <th className="px-4 py-3 border-b text-center">Outstanding</th>
                  <th className="px-4 py-3 border-b text-center">Budget Util %</th>
                  <th className="px-4 py-3 border-b text-left">Critical Shortages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.projects.map((proj) => (
                  <tr key={proj.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{proj.name}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{proj.materialRequirementsReceived}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{proj.posRaisedCount}</td>
                    <td className="px-4 py-3 text-center text-green-600">{proj.deliveriesCompleted}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{proj.outstandingItems}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${proj.budgetUtilization > 90 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {proj.budgetUtilization}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      {proj.criticalShortages.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {proj.criticalShortages.map((s, i) => (
                            <span key={i} className="flex items-center gap-1 text-xs">
                               <AlertTriangle size={10} /> {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={14}/> None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Vendor Performance Summary */}
        <section className="break-inside-avoid">
           <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            4. Vendor Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
             <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-between">
                <div>
                   <span className="text-xs text-gray-500 uppercase font-bold">Quality Issues</span>
                   <span className="block text-2xl font-bold text-gray-900 mt-1">{data.qualityIssuesReported}</span>
                </div>
                <AlertCircle className="text-orange-500 opacity-20" size={32} />
             </div>
             <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-between">
                <div>
                   <span className="text-xs text-gray-500 uppercase font-bold">Delayed Deliveries</span>
                   <span className="block text-2xl font-bold text-red-600 mt-1">{data.deliveriesDelayed}</span>
                </div>
                <Clock className="text-red-500 opacity-20" size={32} />
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 border-b">Vendor Name</th>
                  <th className="px-4 py-3 border-b text-center">Rating</th>
                  <th className="px-4 py-3 border-b text-center">On-Time Delivery</th>
                  <th className="px-4 py-3 border-b text-center">Avg Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                 {data.vendors.map((vendor) => (
                    <tr key={vendor.id}>
                       <td className="px-4 py-3 font-medium text-gray-900">{vendor.name}</td>
                       <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                             vendor.rating === VendorRating.HIGH ? 'bg-green-100 text-green-800' :
                             vendor.rating === VendorRating.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                             'bg-red-100 text-red-800'
                          }`}>
                             {vendor.rating}
                          </span>
                       </td>
                       <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                             <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: `${vendor.onTimeDeliveryScore}%`}}></div>
                             </div>
                             <span>{vendor.onTimeDeliveryScore}%</span>
                          </div>
                       </td>
                       <td className="px-4 py-3 text-center text-gray-600">{vendor.avgLeadTime} days</td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. High Value POs */}
        <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            5. High-Value POs Raised This Week
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 border-b">PO No</th>
                  <th className="px-4 py-3 border-b">Vendor</th>
                  <th className="px-4 py-3 border-b">Project</th>
                  <th className="px-4 py-3 border-b">Material</th>
                  <th className="px-4 py-3 border-b text-right">Value (₹)</th>
                  <th className="px-4 py-3 border-b text-center">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.highValuePOs.map((po) => (
                  <tr key={po.poNumber}>
                    <td className="px-4 py-3 font-mono text-gray-500">{po.poNumber}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{po.vendorName}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{po.projectName}</td>
                    <td className="px-4 py-3 text-gray-600">{po.materialName}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{po.value.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{po.deliveryDueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Pending & Overdue Items */}
        <section className="break-inside-avoid">
           <h3 className="text-lg font-bold text-slate-800 border-l-4 border-red-500 pl-3 mb-4 uppercase tracking-wider">
            6. Pending & Overdue Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                   <Clock size={16} /> Pending & Delayed Metrics
                </h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center border-b border-red-100 pb-2">
                      <span className="text-gray-600">Pending Indents</span>
                      <span className="font-bold text-gray-900">{data.pendingIndentsCount}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-red-100 pb-2">
                      <span className="text-gray-600">Pending Approvals</span>
                      <span className="font-bold text-gray-900">{data.pendingApprovals}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delayed Deliveries</span>
                      <span className="font-bold text-red-600">{data.deliveriesDelayed}</span>
                   </div>
                </div>
             </div>
             
             <div className="bg-white border border-gray-200 rounded-lg p-5">
                 <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                   <ArrowRight size={16} /> Vendor Follow-ups Needed
                </h4>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                   {reportNarrative.vendorFollowUps}
                </div>
             </div>
          </div>
        </section>

         {/* 7. Risks & Issues */}
         <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-red-500 pl-3 mb-4 uppercase tracking-wider">
            7. Risks & Issues
          </h3>
          <div className="bg-white border border-gray-200 p-6 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
            {reportNarrative.risksAndIssues}
          </div>
        </section>

        {/* 8. Action Items */}
        <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            8. Action Items for Next Week
          </h3>
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
            {reportNarrative.actionItems}
          </div>
        </section>

        {/* 9. Conclusion */}
        <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">
            9. Conclusion
          </h3>
          <div className="bg-slate-100 p-6 rounded-lg text-slate-800 italic leading-relaxed whitespace-pre-wrap border border-slate-200">
            {reportNarrative.conclusion}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between text-gray-500 text-xs">
          <p>Generated by AARAA INFRA Procurement System</p>
          <p>Confidential - Internal Circulation Only</p>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;