const express = require('express');
const router = express.Router();
const { getMilestones, updateMilestone } = require('../controllers/milestoneController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getMilestones);
router.put('/:id', authenticate, requireRole(['Project Manager']), updateMilestone);

module.exports = router;
