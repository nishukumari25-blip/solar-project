const Vendor = require('../models/Vendor');
const PurchaseRequisition = require('../models/PurchaseRequisition');
const PurchaseOrder = require('../models/PurchaseOrder');
const ProjectMaterial = require('../models/ProjectMaterial');
const LeftoverMaterial = require('../models/LeftoverMaterial');
const Notification = require('../models/Notification');
const { generateId } = require('../utils/numbering');
const { validateGSTIN } = require('../validators/validators');
const { checkPOValueApproval } = require('../services/approvalService');

// GET /api/vendors
const getVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, count: vendors.length, data: vendors });
  } catch (err) {
    next(err);
  }
};

// POST /api/vendors
const createVendor = async (req, res, next) => {
  try {
    const { name, category, contactPerson, phone, email, city, gstin, pan, isAlmmApproved, isDcrCompliant } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Vendor name is required' });
    if (!validateGSTIN(gstin)) {
      return res.status(400).json({ success: false, message: 'Invalid 15-character Indian GSTIN format.' });
    }

    const count = await Vendor.countDocuments();
    const vendorCode = `VND-${String(count + 1).padStart(3, '0')}`;

    const newVendor = await Vendor.create({
      vendorCode,
      name: name.trim(),
      category: category || 'Solar PV Modules',
      contactPerson: contactPerson || '',
      phone: phone || '',
      email: email || '',
      city: city || 'Jaipur',
      gstin: gstin.toUpperCase(),
      pan: pan ? pan.toUpperCase() : gstin.slice(2, 12).toUpperCase(),
      isAlmmApproved: isAlmmApproved !== undefined ? isAlmmApproved : true,
      isDcrCompliant: isDcrCompliant !== undefined ? isDcrCompliant : true,
      status: 'Active',
      rating: 4.8,
    });

    res.status(201).json({ success: true, message: 'Vendor registered successfully', data: newVendor });
  } catch (err) {
    next(err);
  }
};

// GET /api/purchase-requisitions
const getPurchaseRequisitions = async (req, res, next) => {
  try {
    const prs = await PurchaseRequisition.find().sort({ createdAt: -1 });
    res.json({ success: true, count: prs.length, data: prs });
  } catch (err) {
    next(err);
  }
};

// GET /api/purchase-orders
const getPurchaseOrders = async (req, res, next) => {
  try {
    const pos = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, count: pos.length, data: pos });
  } catch (err) {
    next(err);
  }
};

// POST /api/purchase-orders
const createPurchaseOrder = async (req, res, next) => {
  try {
    const { projectId, vendorId, vendorName, items, totalAmount, shippingAddress } = req.body;

    if (!projectId || !vendorName) {
      return res.status(400).json({ success: false, message: 'Project ID and Vendor Name are required' });
    }

    const count = await PurchaseOrder.countDocuments();
    const poNumber = generateId('PO', count + 1);
    const today = new Date().toISOString().split('T')[0];

    const newPO = new PurchaseOrder({
      poNumber,
      projectId,
      vendorId: vendorId || 'v-1',
      vendorName,
      items: items || [],
      totalAmount: Number(totalAmount || 0),
      shippingAddress: shippingAddress || 'Customer Rooftop Site, Jaipur',
      date: today,
      status: 'Sent',
    });

    // Check approval threshold (> ₹2,00,000)
    await checkPOValueApproval(newPO, totalAmount, 200000, req.user);
    await newPO.save();

    res.status(201).json({
      success: true,
      message: newPO.status === 'Pending Approval'
        ? `Purchase Order created and routed to Approvals Queue (> ₹2,00,000 threshold).`
        : `Purchase Order ${poNumber} issued successfully for direct-to-site fulfillment.`,
      data: newPO,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/materials
const getMaterials = async (req, res, next) => {
  try {
    const materials = await ProjectMaterial.find().sort({ projectId: 1 });
    res.json({ success: true, count: materials.length, data: materials });
  } catch (err) {
    next(err);
  }
};

// GET /api/leftovers
const getLeftovers = async (req, res, next) => {
  try {
    const leftovers = await LeftoverMaterial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: leftovers.length, data: leftovers });
  } catch (err) {
    next(err);
  }
};

// POST /api/leftovers/:id/transfer
const transferLeftover = async (req, res, next) => {
  try {
    const { targetProject } = req.body;
    if (!targetProject) return res.status(400).json({ success: false, message: 'Target project is required' });

    const leftover = await LeftoverMaterial.findById(req.params.id);
    if (!leftover) return res.status(404).json({ success: false, message: 'Leftover record not found' });

    leftover.status = 'Transferred';
    leftover.transferredToProject = targetProject;
    await leftover.save();

    await Notification.create({
      title: 'Leftovers Transferred',
      message: `${leftover.quantity} ${leftover.unit} of ${leftover.itemDescription} transferred from ${leftover.sourceProjectId} to ${targetProject}.`,
      type: 'procurement',
      targetPath: '/procurement/leftovers',
      unread: true,
      timestamp: 'Just now',
    });

    res.json({ success: true, message: `Material transferred to ${targetProject}`, data: leftover });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVendors,
  createVendor,
  getPurchaseRequisitions,
  getPurchaseOrders,
  createPurchaseOrder,
  getMaterials,
  getLeftovers,
  transferLeftover,
};
