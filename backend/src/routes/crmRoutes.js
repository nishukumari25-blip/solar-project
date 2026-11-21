const express = require('express');
const router = express.Router();
const { getLeads, getLeadById, createLead, updateLead } = require('../controllers/crmController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getLeads);
router.get('/:id', authenticate, getLeadById);
router.post('/', authenticate, requireRole(['Sales Executive']), createLead);
router.put('/:id', authenticate, requireRole(['Sales Executive', 'Project Manager']), updateLead);

module.exports = router;
