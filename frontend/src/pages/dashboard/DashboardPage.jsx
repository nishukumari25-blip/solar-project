import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Sun,
  Users,
  CheckCircle2,
  Clock,
  Zap,
  Package,
  Layers,
  ArrowUpRight,
  Plus,
  FileText,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { formatINR, formatKW } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const COLORS = ['#163A5F', '#2563EB', '#0F9D8A', '#F4B740', '#9333EA', '#DC2626'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    projects,
    leads,
    quotations,
    customerPayments,
    subsidies,
    approvals,
    milestones,
    pos,
  } = useERP();

  // Aggregate Metrics
  const activeProjects = projects.filter((p) => p.status === 'In Progress');
  const completedProjects = projects.filter((p) => p.status === 'Closed');
  const delayedProjects = projects.filter((p) => p.isDelayed);

  const totalContractValue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
  const totalReceived = projects.reduce((acc, p) => acc + (p.totalReceived || 0), 0);
  const totalBalanceDue = projects.reduce((acc, p) => acc + (p.balanceDue || 0), 0);
  const totalCapacityKW = projects.reduce((acc, p) => acc + (p.systemCapacityKW || 0), 0);

  const activeLeads = leads.filter((l) => l.status !== 'Lost' && l.status !== 'Converted');
  const convertedLeads = leads.filter((l) => l.status === 'Converted');
  const winRate = leads.length > 0 ? ((convertedLeads.length / leads.length) * 100).toFixed(1) : 0;
  const avgTicket = projects.length > 0 ? totalContractValue / projects.length : 0;

  const netMeteredCount = subsidies.filter((s) => s.currentStage === 'Net Metering Done' || s.currentStage === 'Subsidy Credited to Customer').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending').length;
  const stuckSubsidies = subsidies.filter((s) => s.daysInStage >= 45).length;

  // Chart Data: Revenue vs Collections
  const revenueData = [
    { month: 'Oct 25', sales: 1250000, collections: 950000 },
    { month: 'Nov 25', sales: 1680000, collections: 1400000 },
    { month: 'Dec 25', sales: 1420000, collections: 1300000 },
    { month: 'Jan 26', sales: 2100000, collections: 1850000 },
    { month: 'Feb 26', sales: 1950000, collections: 1720000 },
    { month: 'Mar 26', sales: 2650000, collections: 2200000 },
  ];

  // Chart Data: Lead Funnel
  const leadStageData = [
    { name: 'New Leads', count: leads.filter((l) => l.status === 'New').length },
    { name: 'Survey Scheduled', count: leads.filter((l) => l.status === 'Survey Scheduled').length },
    { name: 'Quote Sent', count: leads.filter((l) => l.status === 'Quote Sent').length },
    { name: 'Under Negotiation', count: leads.filter((l) => l.status === 'Under Negotiation').length },
    { name: 'Won / Converted', count: convertedLeads.length },
  ];

  // Chart Data: Project Stage Distribution
  const stageDistribution = [
    { name: 'Foundation / Structure', value: 2 },
    { name: 'Module Mounting', value: 1 },
    { name: 'Commissioning', value: 1 },
    { name: 'Net Metering / Closed', value: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Welcome */}
      <div className="bg-gradient-to-r from-[#163A5F] to-[#1e4a7a] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400 text-[#163A5F]">
              Solaris EPC ERP 1.0
            </span>
            <span className="text-xs text-slate-300">Direct-to-Site Execution Model</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">Operations & Financial Dashboard</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-2xl">
            Live monitoring of leads, site surveys, multi-stage project milestones, DISCOM net metering, and 100% receivables reconciliation.
          </p>
        </div>

        {/* Quick Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="amber"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/crm/leads')}
          >
            New Lead
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Calendar}
            className="text-white hover:bg-white/10 border border-white/20"
            onClick={() => navigate('/survey/new-survey')}
          >
            Site Survey
          </Button>
          <Button
            variant="teal"
            size="sm"
            icon={FileText}
            onClick={() => navigate('/sales/new-quote')}
          >
            New Quote
          </Button>
        </div>
      </div>

      {/* 12 Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          subtitle={`${completedProjects.length} completed & closed`}
          icon={Briefcase}
          color="blue"
          onClick={() => navigate('/projects/all')}
        />
        <StatCard
          title="Total Contract Value"
          value={formatINR(totalContractValue)}
          subtitle={`Across ${projects.length} signed orders`}
          icon={DollarSign}
          color="primary"
          onClick={() => navigate('/projects/all')}
        />
        <StatCard
          title="Realized Collections"
          value={formatINR(totalReceived)}
          subtitle={`${((totalReceived / (totalContractValue || 1)) * 100).toFixed(1)}% recovery rate`}
          icon={TrendingUp}
          color="emerald"
          onClick={() => navigate('/finance/payments')}
        />
        <StatCard
          title="Receivables Balance"
          value={formatINR(totalBalanceDue)}
          subtitle="Pending customer & bank dues"
          icon={Clock}
          color={totalBalanceDue > 0 ? 'amber' : 'emerald'}
          onClick={() => navigate('/finance/payments')}
        />

        <StatCard
          title="Active CRM Pipeline"
          value={activeLeads.length}
          subtitle={`Win rate: ${winRate}%`}
          icon={Users}
          color="teal"
          onClick={() => navigate('/crm/leads')}
        />
        <StatCard
          title="Avg Ticket Size"
          value={formatINR(avgTicket)}
          subtitle="Contract average per site"
          icon={Zap}
          color="blue"
        />
        <StatCard
          title="Capacity Under Mgmt"
          value={formatKW(totalCapacityKW)}
          subtitle="Total solar DC kWp capacity"
          icon={Sun}
          color="amber"
        />
        <StatCard
          title="Net Metering Done"
          value={netMeteredCount}
          subtitle="Bi-directional meters synchronized"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/subsidy/net-metering')}
        />

        <StatCard
          title="Delayed Projects"
          value={delayedProjects.length}
          subtitle="Needs management escalation"
          icon={AlertTriangle}
          color={delayedProjects.length > 0 ? 'rose' : 'emerald'}
          alertCount={delayedProjects.length}
          onClick={() => navigate('/projects/all?delayed=true')}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals}
          subtitle="Discount / PO / Variance checks"
          icon={AlertCircle}
          color={pendingApprovals > 0 ? 'amber' : 'slate'}
          alertCount={pendingApprovals}
          onClick={() => navigate('/sales/approvals')}
        />
        <StatCard
          title="Stuck Subsidy Apps"
          value={stuckSubsidies}
          subtitle="≥45 days in single stage"
          icon={Clock}
          color={stuckSubsidies > 0 ? 'rose' : 'slate'}
          alertCount={stuckSubsidies}
          onClick={() => navigate('/subsidy/applications')}
        />
        <StatCard
          title="Site POs in Delivery"
          value={pos.filter((p) => p.status === 'Sent' || p.status === 'Partially Received').length}
          subtitle="Direct-to-site dispatches"
          icon={Package}
          color="primary"
          onClick={() => navigate('/procurement/purchase-orders')}
        />
      </div>

      {/* Critical Bottlenecks & Operational Alerts */}
      {(delayedProjects.length > 0 || stuckSubsidies > 0 || pendingApprovals > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-amber-900 text-sm">Actionable Bottlenecks & Regulatory Alerts</h2>
            </div>
            <span className="text-xs text-amber-700 font-medium">Attention Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {delayedProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.projectId}`)}
                className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs hover:border-amber-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-rose-600 font-semibold mb-1">
                  <span>Delayed Project: {p.projectId}</span>
                  <span className="text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">Target Breached</span>
                </div>
                <p className="text-slate-700 font-medium">{p.customerName} ({p.systemCapacityKW} kW)</p>
                <p className="text-slate-500 mt-1">DISCOM meter inspection pending for 28 days.</p>
              </div>
            ))}
            {stuckSubsidies > 0 && (
              <div
                onClick={() => navigate('/subsidy/applications')}
                className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs hover:border-amber-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-amber-700 font-semibold mb-1">
                  <span>Subsidy Stage Delay</span>
                  <span className="text-[10px] bg-amber-50 px-1.5 py-0.5 rounded">≥ 45 Days</span>
                </div>
                <p className="text-slate-700 font-medium">1 Application stuck in DISCOM Inspection</p>
                <p className="text-slate-500 mt-1">Liaison Officer follow-up reminder triggered.</p>
              </div>
            )}
            {pendingApprovals > 0 && (
              <div
                onClick={() => navigate('/sales/approvals')}
                className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs hover:border-amber-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-[#163A5F] font-semibold mb-1">
                  <span>Approvals Queue</span>
                  <span className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded">{pendingApprovals} Pending</span>
                </div>
                <p className="text-slate-700 font-medium">High discount & large PO sign-offs pending</p>
                <p className="text-slate-500 mt-1">Requires Owner / Admin review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Collections Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Sales Booking vs Realized Collections</h2>
              <p className="text-xs text-slate-400">Monthly billing vs actual customer & bank inflows (₹)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#163A5F]" /> Sales
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D8A]" /> Collections
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(val) => [formatINR(val), '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="#163A5F" radius={[4, 4, 0, 0]} name="Sales Booked" />
                <Bar dataKey="collections" fill="#0F9D8A" radius={[4, 4, 0, 0]} name="Collections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Funnel Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Lead Conversion Funnel</h2>
              <p className="text-xs text-slate-400">Current CRM status breakdown</p>
            </div>
            <span className="text-xs font-semibold text-[#163A5F]">{leads.length} Total</span>
          </div>
          <div className="space-y-3 mt-4">
            {leadStageData.map((item, idx) => {
              const pct = leads.length > 0 ? (item.count / leads.length) * 100 : 0;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Conversion:</span>
            <span className="font-bold text-emerald-600">{winRate}%</span>
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Active Solar Projects Overview</h2>
            <p className="text-xs text-slate-400">Direct-to-site project progress, financials, and net-metering stage</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowUpRight}
            onClick={() => navigate('/projects/all')}
          >
            View All Projects
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Project ID</th>
                <th className="py-3 px-4">Customer & Location</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-right">Contract Value</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Subsidy Stage</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.projectId}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#163A5F]">
                    {p.projectId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{p.customerName}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.siteAddress}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {p.systemCapacityKW} kW
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {p.paymentMode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                    {formatINR(p.contractValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`font-semibold ${p.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formatINR(p.balanceDue)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={p.subsidyStage} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={p.status} />
                      {p.isDelayed && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold text-[9px] rounded uppercase">
                          Delayed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
