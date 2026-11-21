const express = require('express');
const router = express.Router();
const {
  getCustomerPayments,
  recordPayment,
  getBankLoans,
  getInvoices,
  getReceipts,
  getVendorBills,
  getProjectPnL,
} = require('../controllers/financeController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/payments', authenticate, getCustomerPayments);
router.post('/payments', authenticate, requireRole(['Accounts']), recordPayment);

router.get('/bank-loans', authenticate, getBankLoans);
router.get('/invoices', authenticate, getInvoices);
router.get('/receipts', authenticate, getReceipts);
router.get('/vendor-bills', authenticate, getVendorBills);
router.get('/pnl', authenticate, getProjectPnL);

module.exports = router;
