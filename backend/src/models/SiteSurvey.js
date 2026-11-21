const mongoose = require('mongoose');

const siteSurveySchema = new mongoose.Schema(
  {
    surveyCode: { type: String, required: true, unique: true, uppercase: true },
    leadId: { type: String, default: null },
    customerName: { type: String, required: true, trim: true },
    mobile: { type: String, trim: true },
    gpsCoordinates: { type: String, required: true },
    roofType: {
      type: String,
      required: true,
      enum: ['RCC Flat Roof', 'Industrial Tin Shed', 'Sloped Tile Roof', 'Elevated Superstructure'],
      default: 'RCC Flat Roof',
    },
    shadowFreeAreaSqFt: { type: Number, required: true },
    tiltAngle: { type: Number, default: 26 },
    azimuth: { type: String, default: 'True South (180°)' },
    electricalPhase: {
      type: String,
      required: true,
      enum: ['1-Phase (230V)', '3-Phase (415V)'],
      default: '3-Phase (415V)',
    },
    cableDistanceMeters: { type: Number, default: 25 },
    surveyorName: { type: String, required: true },
    surveyDate: { type: String, required: true },
    obstacleNotes: { type: String, default: '' },
    photos: {
      rooftop: { type: Boolean, default: false },
      meter: { type: Boolean, default: false },
      inverter: { type: Boolean, default: false },
      obstacle: { type: Boolean, default: false },
    },
    customerAgreed: { type: Boolean, default: true },
    status: { type: String, default: 'Completed', enum: ['Scheduled', 'In Progress', 'Completed'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSurvey', siteSurveySchema);
