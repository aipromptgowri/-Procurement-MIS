import React, { useState, useEffect } from 'react';
import { WeeklyData, ProjectStats, PurchaseOrder, Vendor, POStatus, VendorRating, InvoiceStatus, UserRole } from '../types';
import { Save, RefreshCw, Plus, Trash2, LayoutGrid, Building2, ShoppingCart, Truck, Package, CheckCircle, AlertTriangle, Loader2, DollarSign } from 'lucide-react';

interface DataEditorProps {
  data: WeeklyData;
  onSave: (newData: WeeklyData) => Promise<void>;
  userRole: UserRole;
}

const DataEditor: React.FC<DataEditorProps> = ({ data, onSave, userRole }) => {
  const [localData, setLocalData] = useState<WeeklyData>(data);
  const [activeTab, setActiveTab] = useState<string>('kpi');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
      // Default tabs based on role
      if (userRole === 'finance') {
          setActiveTab('finance');
      } else {
          setActiveTab('kpi');
      }
  }, [userRole]);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      await onSave(localData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof WeeklyData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ed2f39] focus:border-[#ed2f39] text-sm transition-all outline-none";
  const labelClass = "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide";
  const cardClass = "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative";

  const renderFinanceTab = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={cardClass}>
                <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Cash Flow</h4>
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Outstanding Payables</label>
                        <input type="number" value={localData.finance.totalOutstandingPayables} onChange={(e) => {
                            setLocalData({...localData, finance: {...localData.finance, totalOutstandingPayables: Number(e.target.value)}})
                        }} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Weekly Cash Req.</label>
                        <input type="number" value={localData.finance.weeklyCashFlowReq} onChange={(e) => {
                            setLocalData({...localData, finance: {...localData.finance, weeklyCashFlowReq: Number(e.target.value)}})
                        }} className={inputClass} />
                    </div>
                     <div>
                        <label className={labelClass}>Overdue Payables</label>
                        <input type="number" value={localData.finance.overduePayables} onChange={(e) => {
                            setLocalData({...localData, finance: {...localData.finance, overduePayables: Number(e.target.value)}})
                        }} className={inputClass} />
                    </div>
                </div>
              </div>
          </div>
          
          <div className={cardClass}>
              <h4 className="font-bold text-gray-900 mb-4">Manage Invoices</h4>
              <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold">
                      <tr>
                          <th className="p-3 rounded-l-lg">Invoice ID</th>
                          <th className="p-3">Vendor</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 rounded-r-lg">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {localData.finance.recentInvoices.map((inv, idx) => (
                          <tr key={inv.id}>
                              <td className="p-3"><input type="text" value={inv.id} className={inputClass} onChange={(e) => {
                                  const newInv = [...localData.finance.recentInvoices]; newInv[idx].id = e.target.value;
                                  setLocalData({...localData, finance: {...localData.finance, recentInvoices: newInv}});
                              }}/></td>
                               <td className="p-3"><input type="text" value={inv.vendorName} className={inputClass} onChange={(e) => {
                                  const newInv = [...localData.finance.recentInvoices]; newInv[idx].vendorName = e.target.value;
                                  setLocalData({...localData, finance: {...localData.finance, recentInvoices: newInv}});
                              }}/></td>
                               <td className="p-3"><input type="number" value={inv.amount} className={inputClass} onChange={(e) => {
                                  const newInv = [...localData.finance.recentInvoices]; newInv[idx].amount = Number(e.target.value);
                                  setLocalData({...localData, finance: {...localData.finance, recentInvoices: newInv}});
                              }}/></td>
                              <td className="p-3">
                                  <select value={inv.status} className={inputClass} onChange={(e) => {
                                      const newInv = [...localData.finance.recentInvoices]; newInv[idx].status = e.target.value as InvoiceStatus;
                                      setLocalData({...localData, finance: {...localData.finance, recentInvoices: newInv}});
                                  }}>
                                      {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                              </td>
                              <td className="p-3 text-center">
                                  <button onClick={() => {
                                      const newInv = localData.finance.recentInvoices.filter((_, i) => i !== idx);
                                      setLocalData({...localData, finance: {...localData.finance, recentInvoices: newInv}});
                                  }} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              </div>
               <button onClick={() => {
                   const newInv = [...localData.finance.recentInvoices, {
                       id: 'INV-NEW', vendorName: '', poNumber: '', amount: 0, dueDate: '', status: InvoiceStatus.PENDING
                   }];
                   setLocalData({...localData, finance: {...localData.finance, recentInvoices: newInv}});
               }} className="mt-4 flex items-center gap-2 text-[#ed2f39] font-medium text-sm hover:underline"><Plus size={16}/> Add Invoice</button>
          </div>
      </div>
  );

  const renderKPITab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className={cardClass}>
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LayoutGrid size={18} className="text-[#ed2f39]"/> General Info
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
          <ShoppingCart size={18} className="text-[#ed2f39]"/> PO Metrics
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
          <Truck size={18} className="text-[#ed2f39]"/> Delivery Metrics
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
             <button onClick={() => {
                  const newProjects = localData.projects.filter((_, i) => i !== idx);
                  setLocalData({...localData, projects: newProjects});
               }} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
               <Trash2 size={18}/>
             </button>
             <h4 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                <Building2 size={16} className="text-[#ed2f39]"/> {project.name}
             </h4>
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
                   <label className={labelClass}>Req. Received</label>
                   <input type="number" value={project.materialRequirementsReceived} onChange={(e) => {
                    const newP = [...localData.projects]; newP[idx].materialRequirementsReceived = Number(e.target.value);
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
                   <label className={labelClass}>Deliveries</label>
                   <input type="number" value={project.deliveriesCompleted} onChange={(e) => {
                    const newP = [...localData.projects]; newP[idx].deliveriesCompleted = Number(e.target.value);
                    setLocalData({...localData, projects: newP});
                  }} className={inputClass} />
                </div>
             </div>
             
             <div className="mt-4">
                 <label className={labelClass}>Critical Shortages (Comma separated)</label>
                 <input type="text" value={project.criticalShortages.join(', ')} onChange={(e) => {
                    const newP = [...localData.projects]; newP[idx].criticalShortages = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    setLocalData({...localData, projects: newP});
                  }} className={inputClass} placeholder="e.g. Cement, Steel" />
             </div>
          </div>
        ))}
        <button onClick={() => {
          setLocalData({...localData, projects: [...localData.projects, {
            id: `P${Date.now()}`, name: 'New Project', budgetUtilization: 0, materialRequirementsReceived: 0,
            posRaisedCount: 0, deliveriesCompleted: 0, outstandingItems: 0, criticalShortages: []
          }]})
        }} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#ed2f39] hover:text-[#ed2f39] transition-colors flex items-center justify-center gap-2 font-medium bg-gray-50">
          <Plus size={18} /> Add New Project
        </button>
      </div>
  );
  
  const renderPOSTab = () => (
      <div className="space-y-4">
          {localData.highValuePOs.map((po, idx) => (
             <div key={po.poNumber || idx} className={cardClass}>
                 <button onClick={() => {
                      const newPOs = localData.highValuePOs.filter((_, i) => i !== idx);
                      setLocalData({...localData, highValuePOs: newPOs});
                   }} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                   <Trash2 size={18}/>
                 </button>
                 <h4 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                    <ShoppingCart size={16} className="text-[#ed2f39]"/>
                    {po.poNumber || 'New PO'}
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>PO Number</label>
                        <input type="text" value={po.poNumber} className={inputClass} onChange={(e) => {
                          const newPOs = [...localData.highValuePOs]; newPOs[idx].poNumber = e.target.value; setLocalData({...localData, highValuePOs: newPOs});
                        }}/>
                      </div>
                      <div>
                        <label className={labelClass}>Vendor Name</label>
                        <input type="text" value={po.vendorName} className={inputClass} onChange={(e) => {
                          const newPOs = [...localData.highValuePOs]; newPOs[idx].vendorName = e.target.value; setLocalData({...localData, highValuePOs: newPOs});
                        }}/>
                      </div>
                      <div>
                        <label className={labelClass}>Project Name</label>
                        <input type="text" value={po.projectName} className={inputClass} onChange={(e) => {
                          const newPOs = [...localData.highValuePOs]; newPOs[idx].projectName = e.target.value; setLocalData({...localData, highValuePOs: newPOs});
                        }}/>
                      </div>
                      <div>
                        <label className={labelClass}>Material</label>
                        <input type="text" value={po.materialName} className={inputClass} onChange={(e) => {
                          const newPOs = [...localData.highValuePOs]; newPOs[idx].materialName = e.target.value; setLocalData({...localData, highValuePOs: newPOs});
                        }}/>
                      </div>
                       <div>
                        <label className={labelClass}>Value (₹)</label>
                        <input type="number" value={po.value} className={inputClass} onChange={(e) => {
                          const newPOs = [...localData.highValuePOs]; newPOs[idx].value = Number(e.target.value); setLocalData({...localData, highValuePOs: newPOs});
                        }}/>
                      </div>
                      <div>
                        <label className={labelClass}>Delivery Due Date</label>
                        <input type="date" value={po.deliveryDueDate} className={inputClass} onChange={(e) => {
                          const newPOs = [...localData.highValuePOs]; newPOs[idx].deliveryDueDate = e.target.value; setLocalData({...localData, highValuePOs: newPOs});
                        }}/>
                      </div>
                      <div>
                        <label className={labelClass}>Status</label>
                        <select value={po.status} className={inputClass} onChange={(e) => {
                            const newPOs = [...localData.highValuePOs]; newPOs[idx].status = e.target.value as POStatus; setLocalData({...localData, highValuePOs: newPOs});
                        }}>
                             {Object.values(POStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                 </div>
             </div>
          ))}
          <button onClick={() => {
              setLocalData({
                  ...localData, 
                  highValuePOs: [...localData.highValuePOs, {
                    poNumber: `PO-23-${1100 + localData.highValuePOs.length}`,
                    vendorId: '',
                    vendorName: '',
                    projectId: '',
                    projectName: '',
                    materialName: '',
                    value: 0,
                    dateRaised: new Date().toISOString().split('T')[0],
                    deliveryDueDate: '',
                    status: POStatus.PENDING
                  }]
              })
            }} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#ed2f39] hover:text-[#ed2f39] transition-colors flex items-center justify-center gap-2 font-medium bg-gray-50">
              <Plus size={18} /> Add New PO
            </button>
      </div>
  );

  const renderMaterialsTab = () => (
      <div className={cardClass}>
           <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={18} className="text-[#ed2f39]"/> Top Materials
          </h4>
          <table className="w-full">
              {localData.topMaterials.map((mat, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 px-2"><input type="text" value={mat.name} className={inputClass} onChange={(e) => {
                           const newM = [...localData.topMaterials]; newM[idx].name = e.target.value; setLocalData({...localData, topMaterials: newM});
                      }}/></td>
                      <td className="py-2 px-2"><input type="number" value={mat.value} className={inputClass} onChange={(e) => {
                           const newM = [...localData.topMaterials]; newM[idx].value = Number(e.target.value); setLocalData({...localData, topMaterials: newM});
                      }}/></td>
                  </tr>
              ))}
          </table>
      </div>
  );

   const renderVendorsTab = () => (
      <div className="space-y-4">
          {localData.vendors.map((vendor, idx) => (
             <div key={vendor.id} className={cardClass}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className={labelClass}>Name</label><input value={vendor.name} className={inputClass} onChange={(e) => {
                         const newV = [...localData.vendors]; newV[idx].name = e.target.value; setLocalData({...localData, vendors: newV});
                     }}/></div>
                     <div><label className={labelClass}>Rating</label>
                        <select value={vendor.rating} className={inputClass} onChange={(e) => {
                            const newV = [...localData.vendors]; newV[idx].rating = e.target.value as VendorRating; setLocalData({...localData, vendors: newV});
                        }}>
                             {Object.values(VendorRating).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                      <div><label className={labelClass}>On-Time Score (%)</label><input type="number" value={vendor.onTimeDeliveryScore} className={inputClass} onChange={(e) => {
                         const newV = [...localData.vendors]; newV[idx].onTimeDeliveryScore = Number(e.target.value); setLocalData({...localData, vendors: newV});
                     }}/></div>
                      <div><label className={labelClass}>Avg Lead Time (Days)</label><input type="number" value={vendor.avgLeadTime} className={inputClass} onChange={(e) => {
                         const newV = [...localData.vendors]; newV[idx].avgLeadTime = Number(e.target.value); setLocalData({...localData, vendors: newV});
                     }}/></div>
                 </div>
             </div>
          ))}
      </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex gap-2 bg-[#F5F5F7] p-1 rounded-xl overflow-x-auto">
          {userRole !== 'finance' && (
            <>
            <button onClick={() => setActiveTab('kpi')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'kpi' ? 'bg-white text-[#ed2f39] shadow-sm' : 'text-gray-500'}`}>KPIs</button>
            <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white text-[#ed2f39] shadow-sm' : 'text-gray-500'}`}>Projects</button>
            <button onClick={() => setActiveTab('pos')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pos' ? 'bg-white text-[#ed2f39] shadow-sm' : 'text-gray-500'}`}>POs</button>
            <button onClick={() => setActiveTab('vendors')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'vendors' ? 'bg-white text-[#ed2f39] shadow-sm' : 'text-gray-500'}`}>Vendors</button>
            <button onClick={() => setActiveTab('materials')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'materials' ? 'bg-white text-[#ed2f39] shadow-sm' : 'text-gray-500'}`}>Materials</button>
            </>
          )}
          {userRole === 'finance' && (
              <button onClick={() => setActiveTab('finance')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'finance' ? 'bg-white text-[#ed2f39] shadow-sm' : 'text-gray-500'}`}>Finance & Invoices</button>
          )}
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="flex items-center gap-2 px-6 py-2.5 text-white bg-[#ed2f39] rounded-xl hover:bg-[#d9252e] transition-colors shadow-lg shadow-red-200 text-sm font-medium disabled:opacity-70"
           >
             {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
             {isSaving ? 'Saving...' : 'Save Changes'}
           </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 px-6 py-3 text-sm flex items-center gap-2 border-b border-green-100 font-medium">
           <CheckCircle size={16} /> Changes saved successfully.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 bg-[#F5F5F7] rounded-b-2xl border border-gray-200 border-t-0">
        <div className="max-w-5xl mx-auto pb-10">
          {activeTab === 'kpi' && renderKPITab()}
          {activeTab === 'projects' && renderProjectsTab()}
          {activeTab === 'pos' && renderPOSTab()}
          {activeTab === 'vendors' && renderVendorsTab()}
          {activeTab === 'materials' && renderMaterialsTab()}
          {activeTab === 'finance' && renderFinanceTab()}
        </div>
      </div>
    </div>
  );
};

export default DataEditor;