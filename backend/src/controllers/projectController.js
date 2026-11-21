const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const ProjectMaterial = require('../models/ProjectMaterial');
const SerialNumber = require('../models/SerialNumber');
const Subsidy = require('../models/Subsidy');
const BankLoan = require('../models/BankLoan');
const CustomerPayment = require('../models/CustomerPayment');
const Receipt = require('../models/Receipt');
const ProjectPnL = require('../models/ProjectPnL');
const { executeProjectClosure } = require('../services/projectService');

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { status, delayed } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (delayed === 'true') {
      query.isDelayed = true;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const query = req.params.id.startsWith('PRJ-')
      ? { projectId: req.params.id }
      : { _id: req.params.id };

    const project = await Project.findOne(query);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const projectId = project.projectId;

    const [milestones, materials, serials, subsidy, bankLoan, payments, receipts, pnl] = await Promise.all([
      Milestone.find({ projectId }).sort({ sequence: 1 }),
      ProjectMaterial.find({ projectId }),
      SerialNumber.find({ projectId }),
      Subsidy.findOne({ projectId }),
      BankLoan.findOne({ projectId }),
      CustomerPayment.find({ projectId }).sort({ createdAt: -1 }),
      Receipt.find({ projectId }).sort({ createdAt: -1 }),
      ProjectPnL.findOne({ projectId }),
    ]);

    res.json({
      success: true,
      data: {
        project,
        milestones,
        materials,
        serials,
        subsidy,
        bankLoan,
        payments,
        receipts,
        pnl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects/:id/close
const closeProject = async (req, res, next) => {
  try {
    const projectId = req.params.id.startsWith('PRJ-') ? req.params.id : (await Project.findById(req.params.id))?.projectId;
    const closed = await executeProjectClosure(projectId, req.user, req.body);
    res.json({
      success: true,
      message: `Project ${closed.projectId} closed successfully under Triple-Lock approval. Financials locked.`,
      data: closed,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProjectById, closeProject };
