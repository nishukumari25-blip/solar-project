const CustomerPayment = require('../models/CustomerPayment');
const Receipt = require('../models/Receipt');
const BankLoan = require('../models/BankLoan');
const Invoice = require('../models/Invoice');
const VendorBill = require('../models/VendorBill');
const ProjectPnL = require('../models/ProjectPnL');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { generateId } = require('../utils/numbering');

// GET /api/payments
const getCustomerPayments = async (req, res, next) => {
  try {
    const payments = await CustomerPayment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments
const recordPayment = async (req, res, next) => {
  try {
    const { projectId, customerName, amount, paymentMode, referenceNumber, notes } = req.body;

    if (!projectId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid Project ID and positive payment amount are required.' });
    }

    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const payAmount = Number(amount);
    const countReceipts = await Receipt.countDocuments();
    const receiptNumber = generateId('RCT', countReceipts + 1);
    const today = new Date().toISOString().split('T')[0];

    const newPayment = await CustomerPayment.create({
      projectId,
      customerName: customerName || project.customerName,
      amount: payAmount,
      paymentMode: paymentMode || 'Bank Transfer',
      referenceNumber: referenceNumber || `TXN-${Date.now().toString().slice(-6)}`,
      date: today,
      status: 'Received & Verified',
      notes: notes || 'Customer milestone payment',
    });

    const newReceipt = await Receipt.create({
      receiptNumber,
      projectId,
      customerName: customerName || project.customerName,
      amount: payAmount,
      paymentMode: paymentMode || 'Bank Transfer',
      referenceNumber: referenceNumber || `TXN-${Date.now().toString().slice(-6)}`,
      date: today,
    });

    // Update project collections & balance
    project.totalReceived += payAmount;
    project.balanceDue = Math.max(0, project.contractValue - project.totalReceived);
    await project.save();

    await Notification.create({
      title: 'Payment Received & Receipt Issued',
      message: `Receipt ${receiptNumber} (₹${payAmount.toLocaleString('en-IN')}) issued for ${projectId}. New Balance Due: ₹${project.balanceDue.toLocaleString('en-IN')}.`,
      type: 'finance',
      targetPath: '/finance/receipts',
      unread: true,
      timestamp: 'Just now',
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded and official receipt voucher generated.',
      data: {
        payment: newPayment,
        receipt: newReceipt,
        newBalanceDue: project.balanceDue,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/bank-loans
const getBankLoans = async (req, res, next) => {
  try {
    const loans = await BankLoan.find().sort({ createdAt: -1 });
    res.json({ success: true, count: loans.length, data: loans });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices
const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) {
    next(err);
  }
};

// GET /api/receipts
const getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.json({ success: true, count: receipts.length, data: receipts });
  } catch (err) {
    next(err);
  }
};

// GET /api/vendor-bills
const getVendorBills = async (req, res, next) => {
  try {
    const bills = await VendorBill.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bills.length, data: bills });
  } catch (err) {
    next(err);
  }
};

// GET /api/pnl
const getProjectPnL = async (req, res, next) => {
  try {
    const pnl = await ProjectPnL.find().sort({ createdAt: -1 });
    res.json({ success: true, count: pnl.length, data: pnl });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCustomerPayments,
  recordPayment,
  getBankLoans,
  getInvoices,
  getReceipts,
  getVendorBills,
  getProjectPnL,
};
