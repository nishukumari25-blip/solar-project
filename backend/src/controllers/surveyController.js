const SiteSurvey = require('../models/SiteSurvey');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const { generateId } = require('../utils/numbering');

// GET /api/surveys
const getSurveys = async (req, res, next) => {
  try {
    const surveys = await SiteSurvey.find().sort({ createdAt: -1 });
    res.json({ success: true, count: surveys.length, data: surveys });
  } catch (err) {
    next(err);
  }
};

// POST /api/surveys
const createSurvey = async (req, res, next) => {
  try {
    const { leadId, customerName, mobile, gpsCoordinates, roofType, shadowFreeAreaSqFt, tiltAngle, azimuth, electricalPhase, cableDistanceMeters, surveyorName, surveyDate, obstacleNotes, photos } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!gpsCoordinates) {
      return res.status(400).json({ success: false, message: 'GPS Geotag coordinates are required.' });
    }

    const totalSurveys = await SiteSurvey.countDocuments();
    const surveyCode = generateId('SRV', totalSurveys + 1);

    const newSurvey = await SiteSurvey.create({
      surveyCode,
      leadId: leadId || null,
      customerName: customerName.trim(),
      mobile: mobile || '',
      gpsCoordinates,
      roofType: roofType || 'RCC Flat Roof',
      shadowFreeAreaSqFt: Number(shadowFreeAreaSqFt || 500),
      tiltAngle: Number(tiltAngle || 26),
      azimuth: azimuth || 'True South (180°)',
      electricalPhase: electricalPhase || '3-Phase (415V)',
      cableDistanceMeters: Number(cableDistanceMeters || 25),
      surveyorName: surveyorName || req.user?.name || 'Survey Engineer',
      surveyDate: surveyDate || new Date().toISOString().split('T')[0],
      obstacleNotes: obstacleNotes || '',
      photos: photos || { rooftop: true, meter: true, inverter: true, obstacle: false },
      status: 'Completed',
    });

    // Update linked lead
    if (leadId) {
      await Lead.findByIdAndUpdate(leadId, { status: 'Survey Scheduled' });
    }

    await Notification.create({
      title: 'Site Survey Completed',
      message: `Survey ${surveyCode} for ${newSurvey.customerName} completed at ${gpsCoordinates}. Ready for BOM & Quotation.`,
      type: 'survey',
      targetPath: '/survey/site-surveys',
      unread: true,
      timestamp: 'Just now',
    });

    res.status(201).json({ success: true, message: 'Site Survey submitted successfully', data: newSurvey });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSurveys, createSurvey };
