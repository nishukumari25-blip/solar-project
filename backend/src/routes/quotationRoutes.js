const express = require('express');
const router = express.Router();
const {
  getQuotations,
  getQuotationById,
  createQuotation,
  convertToOrder,
  getBOMTemplates,
} = require('../controllers/quotationController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getQuotations);
router.get('/bom-templates', authenticate, getBOMTemplates);
router.get('/:id', authenticate, getQuotationById);
router.post('/', authenticate, requireRole(['Sales Executive']), createQuotation);
router.post('/:id/convert-to-order', authenticate, requireRole(['Sales Executive', 'Project Manager']), convertToOrder);

module.exports = router;
