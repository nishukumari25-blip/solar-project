import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

export default function FollowUpsPage() {
  const navigate = useNavigate();
  const { leads, updateLead } = useERP();

  const [activeTab, setActiveTab] = useState('today');

  // Realistic mock follow-ups derived from active leads
  const activeLeads = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost');

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Daily Follow-up Reminders (9:00 AM Call List)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated sales queue for scheduled follow-ups, overdue customer interactions, and survey visits.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-medium">
            3 Scheduled for Today
          </span>
        </div>
      </div>

      {/* Tabs: Due Today, Overdue, Upcoming */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'today'
              ? 'bg-[#163A5F] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Due Today (3)
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'overdue'
              ? 'bg-rose-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overdue (1)
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-[#163A5F] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming
        </button>
      </div>

      {/* Follow-up Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeLeads.slice(0, 6).map((lead, idx) => {
          const isOverdue = idx === 0 && activeTab === 'overdue';
          return (
            <Card key={lead.id} className="p-4 space-y-3 border-l-4 border-l-[#163A5F]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                    {lead.leadCode}
                  </span>
                  <h3
                    onClick={() => navigate(`/crm/leads/${lead.id}`)}
                    className="font-bold text-slate-900 text-sm hover:text-[#163A5F] cursor-pointer"
                  >
                    {lead.customerName}
                  </h3>
                </div>
                <StatusBadge status={lead.status} />
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Proposed:</span>
                  <span className="font-semibold text-amber-600">{lead.proposedCapacityKW} kW Rooftop</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span>{lead.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Executive:</span>
                  <span className="font-medium text-slate-800">{lead.assignedTo}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                <span className="font-semibold text-slate-700">Agenda:</span> Discuss subsidy paperwork and rooftop shadow measurements from site survey.
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="whatsapp"
                  size="xs"
                  icon={MessageSquare}
                  onClick={() => {
                    const msg = encodeURIComponent(`Hello ${lead.customerName}, following up regarding Solaris EPC solar quotation.`);
                    window.open(`https://wa.me/91${lead.mobile}?text=${msg}`, '_blank');
                  }}
                >
                  WhatsApp
                </Button>

                <Button
                  variant="primary"
                  size="xs"
                  icon={Phone}
                  onClick={() => alert(`Calling ${lead.customerName} at +91 ${lead.mobile}... (Simulated CTI Integration)`)}
                >
                  Call
                </Button>

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    alert(`Follow-up marked complete for ${lead.customerName}.`);
                  }}
                >
                  Done
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
