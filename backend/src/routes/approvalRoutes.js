const express = require('express');
const router = express.Router();
const { getApprovals, decideApproval } = require('../controllers/approvalController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getApprovals);
router.post('/:id/decide', authenticate, requireRole(['Owner / Admin']), decideApproval);

module.exports = router;
