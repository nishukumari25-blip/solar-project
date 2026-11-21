const Subsidy = require('../models/Subsidy');
const WCR = require('../models/WCR');
const ServiceOrder = require('../models/ServiceOrder');
const NetMetering = require('../models/NetMetering');
const Project = require('../models/Project');
const BankLoan = require('../models/BankLoan');
const Notification = require('../models/Notification');

// GET /api/subsidy
const getSubsidies = async (req, res, next) => {
  try {
    const subsidies = await Subsidy.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subsidies.length, data: subsidies });
  } catch (err) {
    next(err);
  }
};

// PUT /api/subsidy/:id
const updateSubsidyStage = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const subsidy = await Subsidy.findById(req.params.id);
    if (!subsidy) return res.status(404).json({ success: false, message: 'Subsidy application not found' });

    subsidy.currentStage = stage;
    subsidy.daysInStage = 1;
    await subsidy.save();

    // Sync to Project
    await Project.findOneAndUpdate(
      { projectId: subsidy.projectId },
      { subsidyStage: stage }
    );

    // If stage is Net Metering Done, unlock Bank Loan Tranche 2!
    if (stage === 'Net Metering Done') {
      await BankLoan.findOneAndUpdate(
        { projectId: subsidy.projectId },
        { tranche2Status: 'Disbursed', status: 'Fully Disbursed' }
      );
      await NetMetering.findOneAndUpdate(
        { projectId: subsidy.projectId },
        { status: 'Synchronized & Operational', unlocksTranche2: true }
      );
      await Notification.create({
        title: 'Net Metering Done & Loan Tranche 2 Unlocked',
        message: `DISCOM Net Metering finalized for ${subsidy.projectId}. Bank Loan Tranche 2 released and Project Closure permitted.`,
        type: 'subsidy',
        targetPath: `/projects/${subsidy.projectId}`,
        unread: true,
        timestamp: 'Just now',
      });
    }

    res.json({ success: true, message: `Subsidy application advanced to ${stage}`, data: subsidy });
  } catch (err) {
    next(err);
  }
};

// GET /api/wcr
const getWCR = async (req, res, next) => {
  try {
    const records = await WCR.find().sort({ createdAt: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

// GET /api/service-orders
const getServiceOrders = async (req, res, next) => {
  try {
    const orders = await ServiceOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/net-metering
const getNetMetering = async (req, res, next) => {
  try {
    const records = await NetMetering.find().sort({ createdAt: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSubsidies,
  updateSubsidyStage,
  getWCR,
  getServiceOrders,
  getNetMetering,
};
