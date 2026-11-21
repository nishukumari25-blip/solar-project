const express = require('express');
const router = express.Router();
const {
  getSubsidies,
  updateSubsidyStage,
  getWCR,
  getServiceOrders,
  getNetMetering,
} = require('../controllers/subsidyController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getSubsidies);
router.put('/:id', authenticate, requireRole(['Liaison']), updateSubsidyStage);

router.get('/wcr', authenticate, getWCR);
router.get('/service-orders', authenticate, getServiceOrders);
router.get('/net-metering', authenticate, getNetMetering);

module.exports = router;
