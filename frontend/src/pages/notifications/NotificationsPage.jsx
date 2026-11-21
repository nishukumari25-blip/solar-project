import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, AlertTriangle, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications } = useERP();

  const [filterType, setFilterType] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications & System Alerts Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time regulatory integrity alerts, delayed project milestones, stuck subsidy notifications, and approvals.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {['ALL', 'projects', 'subsidy', 'approval', 'finance', 'crm'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors capitalize ${
              filterType === type
                ? 'bg-[#163A5F] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type === 'ALL' ? 'All Alerts' : type}
          </button>
        ))}
      </div>

      {/* Notification items list */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <Card
            key={n.id}
            onClick={() => n.targetPath && navigate(n.targetPath)}
            className={`p-4 transition-all flex items-start justify-between gap-3 ${
              n.unread ? 'border-l-4 border-l-[#163A5F] bg-white' : 'border-slate-200 bg-slate-50/60'
            } hover:shadow-xs cursor-pointer`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                  {n.type}
                </span>
                {n.unread && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              <span className="text-[10px] text-slate-400 block font-mono mt-1">{n.timestamp}</span>
            </div>

            <div className="shrink-0 flex items-center text-[#163A5F] text-xs font-semibold gap-1">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
