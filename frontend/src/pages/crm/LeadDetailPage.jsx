import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Zap,
  DollarSign,
  MessageSquare,
  FileText,
  ClipboardList,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatINR } from '../../utils/formatters';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, surveys, quotations, projects } = useERP();

  const lead = leads.find((l) => l.id === id);

  const [newNote, setNewNote] = useState('');

  if (!lead) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800">Lead Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">The requested lead does not exist.</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/crm/leads')}
        >
          Back to Leads
        </Button>
      </div>
    );
  }

  // Find linked items
  const linkedSurveys = surveys.filter((s) => s.leadId === lead.id || s.customerName === lead.customerName);
  const linkedQuotes = quotations.filter((q) => q.leadId === lead.id || q.customerName === lead.customerName);
  const linkedProject = projects.find((p) => p.customerName === lead.customerName);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedNotes = lead.notes ? `${lead.notes}\n[${today}]: ${newNote}` : `[${today}]: ${newNote}`;
    updateLead(lead.id, { notes: updatedNotes });
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/leads')}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#163A5F] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {lead.leadCode}
              </span>
              <StatusBadge status={lead.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{lead.customerName}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="whatsapp"
            size="sm"
            icon={MessageSquare}
            onClick={() => {
              const msg = encodeURIComponent(`Hello ${lead.customerName}, following up regarding your solar installation.`);
              window.open(`https://wa.me/91${lead.mobile}?text=${msg}`, '_blank');
            }}
          >
            WhatsApp
          </Button>

          <Button
            variant="teal"
            size="sm"
            icon={ClipboardList}
            onClick={() => navigate(`/survey/new-survey?leadId=${lead.id}`)}
          >
            Schedule Survey
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={FileText}
            onClick={() => navigate(`/sales/new-quote?leadId=${lead.id}`)}
          >
            Create Quotation
          </Button>
        </div>
      </div>

      {/* Grid: Profile Info & Linked Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Customer Overview Card */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Contact & Sizing Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mobile Phone</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  +91 {lead.mobile}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Address</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {lead.email || '—'}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400">Installation Address</span>
                <span className="font-medium text-slate-800 text-right max-w-[180px]">
                  {lead.address ? `${lead.address}, ` : ''}{lead.city}, {lead.state}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-400">Monthly Power Bill</span>
                <span className="font-bold text-slate-900">
                  {formatINR(lead.monthlyElectricityBill || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sanctioned Load</span>
                <span className="font-semibold text-slate-800">{lead.sanctionedLoadKW || 5} kW</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Proposed Capacity</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {lead.proposedCapacityKW} kW
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Lead Source</span>
                <span className="font-medium text-slate-700">{lead.source}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Sales Executive</span>
                <span className="font-medium text-slate-800">{lead.assignedTo || 'Unassigned'}</span>
              </div>
            </div>
          </Card>

          {/* Linked Order / Project Card if converted */}
          {linkedProject && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Converted to Project!
                </span>
                <span className="font-mono">{linkedProject.projectId}</span>
              </div>
              <p className="text-emerald-700">
                Contract value: {formatINR(linkedProject.contractValue)} ({linkedProject.systemCapacityKW} kW)
              </p>
              <Button
                variant="teal"
                size="sm"
                className="w-full mt-2"
                onClick={() => navigate(`/projects/${linkedProject.projectId}`)}
              >
                Open Project Workspace
              </Button>
            </div>
          )}
        </div>

        {/* Right Col: Notes Timeline & Linked Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes & Activity Log */}
          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Lead Activity & Discussion Log
            </h3>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 whitespace-pre-line max-h-48 overflow-y-auto font-sans leading-relaxed">
              {lead.notes || 'No notes added yet for this lead.'}
            </div>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log discussion notes, customer objections, or next steps..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F]"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm">
                  Add Note
                </Button>
              </div>
            </form>
          </Card>

          {/* Linked Site Surveys */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Site Survey History</h3>
              <span className="text-xs text-slate-400">{linkedSurveys.length} Record(s)</span>
            </div>

            {linkedSurveys.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {linkedSurveys.map((s) => (
                  <div key={s.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-[#163A5F] mr-2">
                        {s.surveyCode}
                      </span>
                      <span className="text-slate-600">
                        {s.roofType} Roof | {s.shadowFreeAreaSqFt} sq ft area
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={s.status} />
                      <span className="text-slate-400">{s.surveyDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                No site survey scheduled or completed for this lead yet.
              </p>
            )}
          </Card>

          {/* Linked Quotations */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Generated Quotations</h3>
              <span className="text-xs text-slate-400">{linkedQuotes.length} Record(s)</span>
            </div>

            {linkedQuotes.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {linkedQuotes.map((q) => (
                  <div key={q.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-[#163A5F] mr-2">
                        {q.quoteNumber}
                      </span>
                      <span className="text-slate-600 font-medium">
                        {q.systemCapacityKW} kW — {formatINR(q.grandTotal)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={q.status} />
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => navigate('/sales/quotations')}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                No quotation generated yet. Click "Create Quotation" to build one.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
