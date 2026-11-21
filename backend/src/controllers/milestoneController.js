const Milestone = require('../models/Milestone');
const GRN = require('../models/GRN');
const Notification = require('../models/Notification');

// GET /api/milestones
const getMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let query = {};
    if (projectId) query.projectId = projectId;

    const milestones = await Milestone.find(query).sort({ projectId: 1, sequence: 1 });
    res.json({ success: true, count: milestones.length, data: milestones });
  } catch (err) {
    next(err);
  }
};

// PUT /api/milestones/:id
const updateMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const { status, completedDate, photoUploaded, proofPhotos } = req.body;

    // Strict Milestone Sequence Rule Check:
    // Milestone 2 (Material Received at Site) requires site GRN delivery
    if (milestone.sequence === 2 && status === 'Completed') {
      const grnExists = await GRN.findOne({ projectId: milestone.projectId, isReversed: false });
      if (!grnExists) {
        return res.status(400).json({
          success: false,
          message: 'Sequence Rule Violation: Milestone 2 (Material Received at Site) is blocked until Site GRN delivery of materials is recorded at customer rooftop.',
        });
      }
    }

    if (status) milestone.status = status;
    if (completedDate) milestone.completedDate = completedDate;
    if (photoUploaded !== undefined) milestone.photoUploaded = photoUploaded;
    if (proofPhotos) milestone.proofPhotos = proofPhotos;

    await milestone.save();

    // Auto-advance next milestone to In Progress if current is completed
    if (status === 'Completed' && milestone.sequence < 7) {
      await Milestone.findOneAndUpdate(
        { projectId: milestone.projectId, sequence: milestone.sequence + 1, status: 'Pending' },
        { status: 'In Progress' }
      );
    }

    res.json({ success: true, message: `Milestone ${milestone.sequence} updated`, data: milestone });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMilestones, updateMilestone };
