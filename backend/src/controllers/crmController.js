const Lead = require('../models/Lead');
const SiteSurvey = require('../models/SiteSurvey');
const Quotation = require('../models/Quotation');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { generateId } = require('../utils/numbering');
const { validateMobile } = require('../validators/validators');

// GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { leadCode: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/:id
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const linkedSurveys = await SiteSurvey.find({
      $or: [{ leadId: lead._id.toString() }, { customerName: lead.customerName }],
    });
    const linkedQuotes = await Quotation.find({
      $or: [{ leadId: lead._id.toString() }, { customerName: lead.customerName }],
    });
    const linkedProject = await Project.findOne({ customerName: lead.customerName });

    res.json({
      success: true,
      data: {
        lead,
        linkedSurveys,
        linkedQuotes,
        linkedProject,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/leads
const createLead = async (req, res, next) => {
  try {
    const { customerName, mobile, email, city, state, address, source, monthlyElectricityBill, sanctionedLoadKW, proposedCapacityKW, assignedTo, notes } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }

    if (!validateMobile(mobile)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    // Check duplicate mobile
    const existing = await Lead.findOne({ mobile: String(mobile).trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Duplicate Mobile Warning: A lead with mobile ${mobile} already exists (${existing.customerName} - ${existing.leadCode}).`,
      });
    }

    const totalLeads = await Lead.countDocuments();
    const leadCode = generateId('LD', totalLeads + 1);

    const newLead = await Lead.create({
      leadCode,
      customerName: customerName.trim(),
      mobile: String(mobile).trim(),
      email: email ? email.trim() : '',
      city: city || 'Jaipur',
      state: state || 'Rajasthan',
      address: address ? address.trim() : '',
      source: source || 'Website Enquiry',
      monthlyElectricityBill: Number(monthlyElectricityBill || 0),
      sanctionedLoadKW: Number(sanctionedLoadKW || 5),
      proposedCapacityKW: Number(proposedCapacityKW || 5),
      assignedTo: assignedTo || 'Rahul Verma',
      status: 'New',
      notes: notes || '',
    });

    await Notification.create({
      title: 'New Lead Registered',
      message: `Lead ${leadCode} (${newLead.customerName}) registered for ${newLead.proposedCapacityKW} kW solar system.`,
      type: 'crm',
      targetPath: `/crm/leads/${newLead._id}`,
      unread: true,
      timestamp: 'Just now',
    });

    res.status(201).json({ success: true, message: 'Lead created successfully', data: newLead });
  } catch (err) {
    next(err);
  }
};

// PUT /api/leads/:id
const updateLead = async (req, res, next) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeads, getLeadById, createLead, updateLead };
