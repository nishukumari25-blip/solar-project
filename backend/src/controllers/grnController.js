const GRN = require('../models/GRN');
const PurchaseOrder = require('../models/PurchaseOrder');
const Milestone = require('../models/Milestone');
const ProjectMaterial = require('../models/ProjectMaterial');
const SerialNumber = require('../models/SerialNumber');
const Notification = require('../models/Notification');
const { generateId } = require('../utils/numbering');
const { verifyAndRegisterSerials } = require('../services/serialService');

// GET /api/grn
const getGRNs = async (req, res, next) => {
  try {
    const grns = await GRN.find().sort({ createdAt: -1 });
    res.json({ success: true, count: grns.length, data: grns });
  } catch (err) {
    next(err);
  }
};

// POST /api/grn
const createGRN = async (req, res, next) => {
  try {
    const { poId, poNumber, projectId, vendorName, challanNumber, deliveryDate, receivedQuantity, itemCategory, serialNumbers, challanPhotoUploaded, remarks } = req.body;

    if (!poId || !challanNumber || !receivedQuantity) {
      return res.status(400).json({ success: false, message: 'PO, delivery challan number, and received quantity are required.' });
    }

    const count = await GRN.countDocuments();
    const grnNumber = generateId('GRN', count + 1);

    // Verify and register serial numbers with system-wide uniqueness guarantee
    const parsedSerials = Array.isArray(serialNumbers)
      ? serialNumbers
      : typeof serialNumbers === 'string'
      ? serialNumbers.split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    await verifyAndRegisterSerials(parsedSerials, projectId, grnNumber, itemCategory || 'Solar PV Modules');

    // Create GRN
    const newGRN = await GRN.create({
      grnNumber,
      poId,
      poNumber,
      projectId,
      vendorName,
      challanNumber,
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      receivedQuantity: Number(receivedQuantity),
      itemCategory: itemCategory || 'Solar PV Modules',
      serialNumbers: parsedSerials,
      challanPhotoUploaded: challanPhotoUploaded !== undefined ? challanPhotoUploaded : true,
      remarks: remarks || '',
      status: 'Received at Site',
      isReversed: false,
    });

    // Update PO status
    await PurchaseOrder.findOneAndUpdate(
      { poNumber },
      { status: 'Fully Received' }
    );

    // Update Project Material
    await ProjectMaterial.findOneAndUpdate(
      { projectId, category: itemCategory },
      { $inc: { grnQty: Number(receivedQuantity) } }
    );

    // Regulatory trigger: Site GRN completion unlocks Milestone 2 (Mounting Structure Installation)
    await Milestone.findOneAndUpdate(
      { projectId, sequence: 2, status: 'Pending' },
      { status: 'In Progress' }
    );

    await Notification.create({
      title: 'Site Delivery Recorded (GRN)',
      message: `GRN ${grnNumber} generated for ${projectId}. ${parsedSerials.length} serials verified. Milestone 2 (Mounting Structure) unlocked.`,
      type: 'procurement',
      targetPath: '/procurement/grn',
      unread: true,
      timestamp: 'Just now',
    });

    res.status(201).json({
      success: true,
      message: `Site GRN ${grnNumber} recorded successfully. Serials verified unique across database.`,
      data: newGRN,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/grn/:id/reverse (Reverse with reason instead of delete)
const reverseGRN = async (req, res, next) => {
  try {
    const { reversalReason } = req.body;
    if (!reversalReason) {
      return res.status(400).json({ success: false, message: 'Reversal reason is mandatory' });
    }

    const grn = await GRN.findById(req.params.id);
    if (!grn) return res.status(404).json({ success: false, message: 'GRN not found' });
    if (grn.isReversed) return res.status(400).json({ success: false, message: 'GRN has already been reversed' });

    grn.isReversed = true;
    grn.reversalReason = reversalReason;
    grn.status = 'Reversed';
    await grn.save();

    // Release serials
    await SerialNumber.deleteMany({ grnNumber: grn.grnNumber });

    res.json({ success: true, message: `GRN ${grn.grnNumber} reversed successfully.`, data: grn });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGRNs, createGRN, reverseGRN };
