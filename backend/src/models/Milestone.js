const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    sequence: { type: Number, required: true, min: 1, max: 7 },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'In Progress', 'Completed'],
    },
    targetDate: { type: String },
    completedDate: { type: String, default: null },
    photoRequired: { type: Boolean, default: true },
    photoUploaded: { type: Boolean, default: false },
    proofPhotos: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
