const express = require('express');
const router = express.Router();
const {
  getVendors,
  createVendor,
  getPurchaseRequisitions,
  getPurchaseOrders,
  createPurchaseOrder,
  getMaterials,
  getLeftovers,
  transferLeftover,
} = require('../controllers/procurementController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/vendors', authenticate, getVendors);
router.post('/vendors', authenticate, requireRole(['Purchase']), createVendor);

router.get('/purchase-requisitions', authenticate, getPurchaseRequisitions);

router.get('/purchase-orders', authenticate, getPurchaseOrders);
router.post('/purchase-orders', authenticate, requireRole(['Purchase']), createPurchaseOrder);

router.get('/materials', authenticate, getMaterials);
router.get('/leftovers', authenticate, getLeftovers);
router.post('/leftovers/:id/transfer', authenticate, requireRole(['Project Manager', 'Purchase']), transferLeftover);

module.exports = router;
