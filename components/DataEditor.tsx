import React, { useState, useEffect } from 'react';
import { WeeklyData, ProjectStats, PurchaseOrder, Vendor, POStatus, VendorRating } from '../types';
import { Save, RefreshCw, Plus, Trash2, LayoutGrid, Building2, ShoppingCart, Truck, Package, CheckCircle, AlertTriangle } from 'lucide-react';

interface DataEditorProps {
  data: WeeklyData;
  onSave: (newData: WeeklyData) => void;
}

const DataEditor: React.FC<DataEditorProps> = ({ data, onSave }) => {
  const [localData, setLocalData] = useState<WeeklyData>(data);
  const [activeTab, setActiveTab] = useState<'kpi' | 'projects' | 'pos' | 'vendors' | 'materials'>('kpi');
  const [success, setSuccess] = useState(false);

  // Sync state if prop changes (optional, but good for reset)
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSave = () => {
    onSave(localData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to discard unsaved changes?")) {
      setLocalData(data);
    }
  };

  const updateField = (field: keyof WeeklyData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";
  const cardClass = "bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative";

  const renderKPITab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className={cardClass}>
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LayoutGrid size={18} className="text-blue-600"/> General Info
        </h4>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Week Starting Date</label>
            <input 
              type="text" 
              value={localData.weekStarting} 
              onChange={(e) => updateField('weekStarting', e.target.value)} 
              className={inputClass} 
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart size={18} className="text-blue-600"/> PO Metrics
        </h4>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Total POs Raised</label>
            <input type="number" value={localData.totalPOsRaised} onChange={(e) => updateField('totalPOsRaised', Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Total PO Value (₹)</label>
            <input type="number" value={localData.totalPOValue} onChange={(e) => updateField('totalPOValue', Number(e.target.value))} className={inputClass} />
          </div>
          <div>
             <label className={labelClass}>Pending Approvals</label>
             <input type="number" value={localData.pendingApprovals} onChange={(e) => updateField('pendingApprovals', Number(e.target.value))} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Truck size={18} className="text-blue-600"/> Delivery & Indents
        </h4>
        <div className="space-y-4">
           <div>
            <label className={labelClass}>Deliveries Completed</label>
            <input type="number" value={localData.deliveriesCompleted} onChange={(e) => updateField('deliveriesCompleted', Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Deliveries Delayed</label>
            <input type="number" value={localData.deliveriesDelayed} onChange={(e) => updateField('deliveriesDelayed', Number(e.target.value))} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div>
                <label className={labelClass}>Pending Indents</label>
                <input type="number" value={localData.pendingIndentsCount} onChange={(e) => updateField('pendingIndentsCount', Number(e.target.value))} className={inputClass} />
             </div>
             <div>
                <label className={labelClass}>Indent Value</label>
                <input type="number" value={localData.pendingIndentsValue} onChange={(e) => updateField('pendingIndentsValue', Number(e.target.value))} className={inputClass} />
             </div>
          </div>
           <div>
            <label className={labelClass}>Quality Issues</label>
            <input type="number" value={localData.qualityIssuesReported} onChange={(e) => updateField('qualityIssuesReported', Number(e.target.value))} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-4">
      {localData.projects.map((project, idx) => (
        <div key={project.id} className={cardClass}>
           <button 
             onClick={() => {
                const newProjects = localData.projects.filter((_, i) => i !== idx);
                setLocalData({...localData, projects: newProjects});
             }} 
             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
             title="Remove Project"
           >
             <Trash2 size={18}/>
           </button>
           
           <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Project #{idx + 1}</h4>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Project Name</label>
                <input type="text" value={project.name} onChange={(e) => {
                  const newP = [...localData.projects]; newP[idx].name = e.target.value;
                  setLocalData({...localData, projects: newP});
                }} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Budget Util %</label>
                <input type="number" value={project.budgetUtilization} onChange={(e) => {
                  const newP = [...localData.projects]; newP[idx].budgetUtilization = Number(e.target.value);
                  setLocalData({...localData, projects: newP});
                }} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>POs Raised</label>
                <input type="number" value={project.posRaisedCount} onChange={(e) => {
                  const newP = [...localData.projects]; newP[idx].posRaisedCount = Number(e.target.value);
                  setLocalData({...localData, projects: newP});
                }} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Reqs Received</label>
                <input type="number" value={project.materialRequirementsReceived} onChange={(e) => {
                   const newP = [...localData.projects]; newP[idx].materialRequirementsReceived = Number(e.target.value);
                   setLocalData({...localData, projects: newP});
                }} className={inputClass} />
              </div>
              <div>
                 <label className={labelClass}>Deliveries Done</label>
                 <input type="number" value={project.deliveriesCompleted} onChange={(e) => {
                   const newP = [...localData.projects]; newP[idx].deliveriesCompleted = Number(e.target.value);
                   setLocalData({...localData, projects: newP});
                }} className={inputClass} />
              </div>
               <div>
                 <label className={labelClass}>Outstanding</label>
                 <input type="number" value={project.outstandingItems} onChange={(e) => {
                   const newP = [...localData.projects]; newP[idx].outstandingItems = Number(e.target.value);
                   setLocalData({...localData, projects: newP});
                }} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                 <label className={labelClass}>Critical Shortages (Comma separated)</label>
                 <input type="text" value={project.criticalShortages.join(', ')} onChange={(e) => {
                    const newP = [...localData.projects]; 
                    newP[idx].criticalShortages = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                    setLocalData({...localData, projects: newP});
                 }} className={inputClass} placeholder="e.g. Cement, Steel (Comma separated)" />
              </div>
           </div>
        </div>
      ))}
      <button onClick={() => {
        setLocalData({...localData, projects: [...localData.projects, {
          id: `P${Date.now()}`, name: 'New Project', budgetUtilization: 0, materialRequirementsReceived: 0,
          posRaisedCount: 0, deliveriesCompleted: 0, outstandingItems: 0, criticalShortages: []
        }]})
      }} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium">
        <Plus size={18} /> Add New Project
      </button>
    </div>
  );

  const renderPOSTab = () => (
    <div className="space-y-4">
       {localData.highValuePOs.map((po, idx) => (
         <div key={po.poNumber} className={cardClass}>
           <button 
             onClick={() => {
                const newPOs = localData.highValuePOs.filter((_, i) => i !== idx);
                setLocalData({...localData, highValuePOs: newPOs});
             }} 
             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
           >
             <Trash2 size={18}/>
           </button>
           <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">PO: {po.poNumber}</h4>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>PO Number</label>
                <input type="text" value={po.poNumber} onChange={(e) => {
                  const newPOs = [...localData.highValuePOs]; newPOs[idx].poNumber = e.target.value;
                  setLocalData({...localData, highValuePOs: newPOs});
                }} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Vendor Name</label>
                <input type="text" value={po.vendorName} onChange={(e) => {
                   const newPOs = [...localData.highValuePOs]; newPOs[idx].vendorName = e.target.value;
                   setLocalData({...localData, highValuePOs: newPOs});
                }} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select 
                  value={po.status} 
                  onChange={(e) => {
                    const newPOs = [...localData.highValuePOs]; newPOs[idx].status = e.target.value as POStatus;
                    setLocalData({...localData, highValuePOs: newPOs});
                  }}
                  className={inputClass}
                >
                   {Object.values(POStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                 <label className={labelClass}>Material Name</label>
                 <input type="text" value={po.materialName} onChange={(e) => {
                   const newPOs = [...localData.highValuePOs]; newPOs[idx].materialName = e.target.value;
                   setLocalData({...localData, highValuePOs: newPOs});
                 }} className={inputClass} />
              </div>
              <div>
                 <label className={labelClass}>Value (₹)</label>
                 <input type="number" value={po.value} onChange={(e) => {
                   const newPOs = [...localData.highValuePOs]; newPOs[idx].value = Number(e.target.value);
                   setLocalData({...localData, highValuePOs: newPOs});
                 }} className={inputClass} />
              </div>
              <div>
                 <label className={labelClass}>Project Name</label>
                 <input type="text" value={po.projectName} onChange={(e) => {
                   const newPOs = [...localData.highValuePOs]; newPOs[idx].projectName = e.target.value;
                   setLocalData({...localData, highValuePOs: newPOs});
                 }} className={inputClass} />
              </div>
              <div>
                 <label className={labelClass}>Delivery Due Date</label>
                 <input type="date" value={po.deliveryDueDate} onChange={(e) => {
                   const newPOs = [...localData.highValuePOs]; newPOs[idx].deliveryDueDate = e.target.value;
                   setLocalData({...localData, highValuePOs: newPOs});
                 }} className={inputClass} />
              </div>
           </div>
         </div>
       ))}
       <button onClick={() => {
        setLocalData({...localData, highValuePOs: [...localData.highValuePOs, {
          poNumber: `PO-${Date.now()}`, vendorId: 'V99', vendorName: 'New Vendor', projectId: 'P99', 
          projectName: 'Project', materialName: 'Material', value: 0, dateRaised: new Date().toISOString().split('T')[0], 
          deliveryDueDate: new Date().toISOString().split('T')[0], status: POStatus.PENDING
        }]})
      }} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium">
        <Plus size={18} /> Add PO
      </button>
    </div>
  );

  const renderVendorsTab = () => (
    <div className="space-y-4">
      {localData.vendors.map((vendor, idx) => (
         <div key={vendor.id} className={cardClass}>
           <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Vendor: {vendor.name}</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="md:col-span-2">
                <label className={labelClass}>Vendor Name</label>
                <input type="text" value={vendor.name} onChange={(e) => {
                   const newV = [...localData.vendors]; newV[idx].name = e.target.value;
                   setLocalData({...localData, vendors: newV});
                }} className={inputClass} />
             </div>
             <div>
                <label className={labelClass}>Rating</label>
                 <select 
                  value={vendor.rating} 
                  onChange={(e) => {
                    const newV = [...localData.vendors]; newV[idx].rating = e.target.value as VendorRating;
                    setLocalData({...localData, vendors: newV});
                  }}
                  className={inputClass}
                >
                   {Object.values(VendorRating).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
             <div>
                <label className={labelClass}>On-Time Score %</label>
                <input type="number" value={vendor.onTimeDeliveryScore} onChange={(e) => {
                   const newV = [...localData.vendors]; newV[idx].onTimeDeliveryScore = Number(e.target.value);
                   setLocalData({...localData, vendors: newV});
                }} className={inputClass} />
             </div>
             <div>
                <label className={labelClass}>Lead Time (Days)</label>
                <input type="number" value={vendor.avgLeadTime} onChange={(e) => {
                   const newV = [...localData.vendors]; newV[idx].avgLeadTime = Number(e.target.value);
                   setLocalData({...localData, vendors: newV});
                }} className={inputClass} />
             </div>
           </div>
         </div>
      ))}
    </div>
  );

  const renderMaterialsTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Name</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend (₹)</th>
           </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
           {localData.topMaterials.map((mat, idx) => (
             <tr key={idx}>
               <td className="px-6 py-4">
                  <input type="text" value={mat.name} onChange={(e) => {
                     const newM = [...localData.topMaterials]; newM[idx].name = e.target.value;
                     setLocalData({...localData, topMaterials: newM});
                  }} className={inputClass} />
               </td>
               <td className="px-6 py-4">
                  <input type="number" value={mat.value} onChange={(e) => {
                     const newM = [...localData.topMaterials]; newM[idx].value = Number(e.target.value);
                     setLocalData({...localData, topMaterials: newM});
                  }} className={inputClass} />
               </td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {(['kpi', 'projects', 'pos', 'vendors', 'materials'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'kpi' ? 'KPIs' : 
               tab === 'pos' ? 'Purchase Orders' : 
               tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={handleReset}
             className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
           >
             <RefreshCw size={16} /> Reset
           </button>
           <button 
             onClick={handleSave}
             className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
           >
             <Save size={16} /> Save Changes
           </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 text-green-700 px-6 py-3 text-sm flex items-center gap-2 border-b border-green-100 font-medium animate-fade-in">
           <CheckCircle size={16} /> Data updated successfully!
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 rounded-b-xl border border-gray-200 border-t-0">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'kpi' && renderKPITab()}
          {activeTab === 'projects' && renderProjectsTab()}
          {activeTab === 'pos' && renderPOSTab()}
          {activeTab === 'vendors' && renderVendorsTab()}
          {activeTab === 'materials' && renderMaterialsTab()}
        </div>
      </div>
    </div>
  );
};

export default DataEditor;