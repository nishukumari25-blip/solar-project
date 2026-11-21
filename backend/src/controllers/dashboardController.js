const Project = require('../models/Project');
const Lead = require('../models/Lead');
const Subsidy = require('../models/Subsidy');
const Approval = require('../models/Approval');
const PurchaseOrder = require('../models/PurchaseOrder');
const Quotation = require('../models/Quotation');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const projects = await Project.find();
    const leads = await Lead.find();
    const subsidies = await Subsidy.find();
    const approvals = await Approval.find();
    const pos = await PurchaseOrder.find();

    const activeProjects = projects.filter((p) => p.status === 'In Progress');
    const closedProjects = projects.filter((p) => p.status === 'Closed');
    const delayedProjects = projects.filter((p) => p.isDelayed);

    const totalContractValue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
    const totalReceived = projects.reduce((acc, p) => acc + (p.totalReceived || 0), 0);
    const totalBalanceDue = projects.reduce((acc, p) => acc + (p.balanceDue || 0), 0);
    const totalCapacityKW = projects.reduce((acc, p) => acc + (p.systemCapacityKW || 0), 0);

    const activeLeads = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost');
    const convertedLeads = leads.filter((l) => l.status === 'Converted');
    const winRate = leads.length > 0 ? ((convertedLeads.length / leads.length) * 100).toFixed(1) : 0;
    const avgTicket = projects.length > 0 ? Math.round(totalContractValue / projects.length) : 0;

    const netMeteredCount = subsidies.filter(
      (s) => s.currentStage === 'Net Metering Done' || s.currentStage === 'Subsidy Credited to Customer'
    ).length;
    const stuckSubsidies = subsidies.filter((s) => s.daysInStage >= 45).length;
    const pendingApprovals = approvals.filter((a) => a.status === 'Pending').length;
    const posInDelivery = pos.filter((p) => p.status === 'Sent' || p.status === 'Partially Received').length;

    res.json({
      success: true,
      data: {
        activeProjects: activeProjects.length,
        closedProjects: closedProjects.length,
        delayedProjects: delayedProjects.length,
        totalContractValue,
        totalReceived,
        totalBalanceDue,
        totalCapacityKW,
        activeLeads: activeLeads.length,
        totalLeads: leads.length,
        winRate,
        avgTicket,
        netMeteredCount,
        stuckSubsidies,
        pendingApprovals,
        posInDelivery,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/charts
const getDashboardCharts = async (req, res, next) => {
  try {
    const leads = await Lead.find();

    const revenueData = [
      { month: 'Oct 25', sales: 1250000, collections: 950000 },
      { month: 'Nov 25', sales: 1680000, collections: 1400000 },
      { month: 'Dec 25', sales: 1420000, collections: 1300000 },
      { month: 'Jan 26', sales: 2100000, collections: 1850000 },
      { month: 'Feb 26', sales: 1950000, collections: 1720000 },
      { month: 'Mar 26', sales: 2650000, collections: 2200000 },
    ];

    const leadFunnelData = [
      { name: 'New Leads', count: leads.filter((l) => l.status === 'New').length },
      { name: 'Survey Scheduled', count: leads.filter((l) => l.status === 'Survey Scheduled').length },
      { name: 'Quote Sent', count: leads.filter((l) => l.status === 'Quote Sent').length },
      { name: 'Under Negotiation', count: leads.filter((l) => l.status === 'Under Negotiation').length },
      { name: 'Won / Converted', count: leads.filter((l) => l.status === 'Converted').length },
    ];

    res.json({
      success: true,
      data: {
        revenueData,
        leadFunnelData,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats, getDashboardCharts };
