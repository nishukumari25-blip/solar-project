const Quotation = require('../models/Quotation');
const BOMTemplate = require('../models/BOMTemplate');
const { generateQuoteId } = require('../utils/numbering');
const { validateNetCustomerCost, validateInstalmentsTotal } = require('../validators/validators');
const { checkQuotationDiscountApproval } = require('../services/approvalService');
const { atomicConvertQuotationToOrder } = require('../services/projectService');

// GET /api/quotations
const getQuotations = async (req, res, next) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json({ success: true, count: quotations.length, data: quotations });
  } catch (err) {
    next(err);
  }
};

// GET /api/quotations/:id
const getQuotationById = async (req, res, next) => {
  try {
    const quote = await Quotation.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

// POST /api/quotations
const createQuotation = async (req, res, next) => {
  try {
    const { customerName, leadId, systemCapacityKW, items, basePrice, gstAmount, discountAmount, grandTotal, totalSubsidy, netCustomerCost, instalments } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    // Business rule: Net customer cost >= 0
    if (!validateNetCustomerCost(grandTotal, totalSubsidy)) {
      return res.status(400).json({ success: false, message: 'Net Customer Cost cannot be negative.' });
    }

    // Business rule: Instalments total == Grand Total
    if (!validateInstalmentsTotal(instalments, grandTotal)) {
      return res.status(400).json({ success: false, message: 'Sum of payment instalment schedule must equal Grand Total.' });
    }

    const totalQuotes = await Quotation.countDocuments();
    const quoteNumber = generateQuoteId(totalQuotes + 1, 1);
    const today = new Date().toISOString().split('T')[0];
    const validityDate = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    const newQuote = new Quotation({
      quoteNumber,
      version: 'R1',
      customerName: customerName.trim(),
      leadId: leadId || null,
      systemCapacityKW: Number(systemCapacityKW || 5),
      items: items || [],
      basePrice: Number(basePrice),
      gstAmount: Number(gstAmount || 0),
      discountAmount: Number(discountAmount || 0),
      grandTotal: Number(grandTotal),
      totalSubsidy: Number(totalSubsidy || 0),
      netCustomerCost: Number(netCustomerCost),
      instalments: instalments || [],
      status: 'Sent',
      date: today,
      validityDate,
    });

    // Check discount approval threshold (default 5%)
    await checkQuotationDiscountApproval(newQuote, discountAmount, grandTotal, 5, req.user);
    await newQuote.save();

    res.status(201).json({
      success: true,
      message: newQuote.status === 'Pending Approval'
        ? 'Quotation created and routed to Approvals Queue due to high discount (>5%).'
        : 'Quotation generated successfully.',
      data: newQuote,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/quotations/:id/convert-to-order
const convertToOrder = async (req, res, next) => {
  try {
    const project = await atomicConvertQuotationToOrder(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      message: `Quotation converted to Order. Project ${project.projectId} initialized atomically with 7 milestones and procurement PRs.`,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/bom-templates
const getBOMTemplates = async (req, res, next) => {
  try {
    const templates = await BOMTemplate.find();
    res.json({ success: true, count: templates.length, data: templates });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuotations,
  getQuotationById,
  createQuotation,
  convertToOrder,
  getBOMTemplates,
};
