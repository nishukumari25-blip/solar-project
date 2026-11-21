const Approval = require('../models/Approval');
const { processDecision } = require('../services/approvalService');

// GET /api/approvals
const getApprovals = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'ALL') query.status = status;

    const approvals = await Approval.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: approvals.length, data: approvals });
  } catch (err) {
    next(err);
  }
};

// POST /api/approvals/:id/decide
const decideApproval = async (req, res, next) => {
  try {
    const { isApproved, remarks } = req.body;
    if (isApproved === undefined) {
      return res.status(400).json({ success: false, message: 'Approval decision (isApproved: true/false) is required' });
    }

    const result = await processDecision(req.params.id, Boolean(isApproved), remarks, req.user);
    res.json({
      success: true,
      message: `Approval request ${result.status.toLowerCase()} successfully.`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getApprovals, decideApproval };
