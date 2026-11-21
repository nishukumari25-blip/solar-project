const express = require('express');
const router = express.Router();
const { getGRNs, createGRN, reverseGRN } = require('../controllers/grnController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getGRNs);
router.post('/', authenticate, requireRole(['Project Manager', 'Purchase']), createGRN);
router.post('/:id/reverse', authenticate, requireRole(['Owner / Admin']), reverseGRN);

module.exports = router;
