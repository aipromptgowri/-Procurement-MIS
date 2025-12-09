import React, { useState } from 'react';
import { WeeklyData, GeneratedReportSections, POStatus, VendorRating } from '../types';
import { generateReportNarrative } from '../services/geminiService';
import { FileText, Printer, Sparkles, AlertCircle, CheckCircle2, AlertTriangle, Clock, ArrowRight, Loader2 } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl border border-dashed border-gray-300">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <FileText size={48} className="text-[#ed2f39]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly MIS Report</h2>
        <p className="text-gray-500 max-w-md text-center mb-8 text-sm">
          Generate a comprehensive, AI-enhanced report for the week starting {data.weekStarting}.
        </p>
        
        {loading ? (
          <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl text-gray-500 cursor-wait font-medium">
            <Loader2 className="animate-spin" size={20} />
            Generating narrative...
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-3 bg-[#ed2f39] hover:bg-[#d9252e] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-200"
          >
            <Sparkles size={18} />
            Generate Weekly Report
          </button>
        )}
        
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden report-container print:shadow-none">
      {/* Report Header */}
      <div className="p-8 border-b border-gray-200 bg-white flex justify-between items-center print-only">
        <div className="flex items-center gap-4">
           <img src="https://aaraainfrastructure.com/logo.png" alt="Logo" className="h-12" />
           <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-bold tracking-wide text-gray-900">AARAA INFRA</h1>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Procurement Department</p>
           </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900">Weekly MIS Report</h2>
          <p className="text-gray-500 text-sm mt-1">Week of: {data.weekStarting}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Printer size={18} />
          Print / Save PDF
        </button>
      </div>

      {/* Report Content */}
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 report-scroll text-sm md:text-base">
        
        {/* 1. Executive Summary */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#ed2f39] pl-4 mb-4 uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <div className="bg-[#F5F5F7] p-6 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
            {reportNarrative.executiveSummary}
          </div>
        </section>

        {/* 2. Procurement KPIs */}
        <section className="break-inside-avoid">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#ed2f39] pl-4 mb-4 uppercase tracking-wider">
            2. Procurement KPIs (Weekly)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-xl bg-white text-center">
              <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">POs Raised</span>
              <span className="block text-2xl font-bold text-gray-900 mt-1">{data.totalPOsRaised}</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl bg-white text-center">
              <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">PO Value</span>
              <span className="block text-2xl font-bold text-gray-900 mt-1">{formatCurrency(data.totalPOValue)}</span>
            </div>
             <div className="p-4 border border-gray-200 rounded-xl bg-white text-center">
              <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Delivered</span>
              <span className="block text-2xl font-bold text-green-600 mt-1">{data.deliveriesCompleted}</span>
            </div>
             <div className="p-4 border border-gray-200 rounded-xl bg-white text-center">
              <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Delayed</span>
              <span className="block text-2xl font-bold text-red-600 mt-1">{data.deliveriesDelayed}</span>
            </div>
          </div>
          
           <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 border-b">Top Material</th>
                  <th className="px-6 py-4 border-b text-right">Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.topMaterials.map((mat, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-3 font-medium text-gray-900">{mat.name}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{formatCurrency(mat.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ... Other sections follow similar style updates ... */}
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between text-gray-400 text-xs">
          <p>Generated by AARAA INFRA MIS System</p>
          <p>Confidential</p>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;