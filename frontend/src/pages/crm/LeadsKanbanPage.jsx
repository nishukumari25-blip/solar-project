import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, MapPin, MessageSquare, ArrowUpRight, List } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/common/Button';

const STAGES = [
  { id: 'New', label: 'New Enquiries', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
  { id: 'Survey Scheduled', label: 'Survey Scheduled', color: 'border-teal-400 bg-teal-50/40 text-teal-800' },
  { id: 'Quote Sent', label: 'Quote Sent', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
  { id: 'Under Negotiation', label: 'Under Negotiation', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
  { id: 'Converted', label: 'Won / Converted', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
  { id: 'Lost', label: 'Lost / Disqualified', color: 'border-slate-300 bg-slate-50/40 text-slate-600' },
];

export default function LeadsKanbanPage() {
  const navigate = useNavigate();
  const { leads, updateLead } = useERP();

  const handleStageChange = (leadId, newStage) => {
    updateLead(leadId, { status: newStage });
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leads Kanban Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual stage progression of active customer opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={List}
            onClick={() => navigate('/crm/leads')}
          >
            Table View
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/crm/leads')}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className="bg-slate-100/80 rounded-xl p-3 border border-slate-200/80 min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <span className="font-semibold text-xs text-slate-800">{stage.label}</span>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-white border border-slate-200 text-slate-600">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-semibold text-[#163A5F] bg-blue-50 px-1.5 py-0.5 rounded">
                        {lead.leadCode}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        {lead.proposedCapacityKW} kW
                      </span>
                    </div>

                    <div>
                      <h4
                        onClick={() => navigate(`/crm/leads/${lead.id}`)}
                        className="font-semibold text-slate-900 text-xs hover:text-[#163A5F] cursor-pointer"
                      >
                        {lead.customerName}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{lead.city}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Bill: ₹{lead.monthlyElectricityBill?.toLocaleString('en-IN')}</span>
                      
                      {/* WhatsApp One-tap button */}
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(
                            `Hello ${lead.customerName}, regarding your ${lead.proposedCapacityKW} kW solar system inquiry with Solaris EPC.`
                          );
                          window.open(`https://wa.me/91${lead.mobile}?text=${message}`, '_blank');
                        }}
                        className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Move Stage Dropdown */}
                    <div className="pt-1">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStageChange(lead.id, e.target.value)}
                        className="w-full text-[10px] py-1 px-1.5 border border-slate-200 rounded bg-slate-50 text-slate-600 font-medium focus:outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move to: {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
