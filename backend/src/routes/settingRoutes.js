const express = require('express');
const router = express.Router();
const { getSettings, updateCompany, updateThresholds } = require('../controllers/settingController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getSettings);
router.put('/company', authenticate, requireRole(['Owner / Admin']), updateCompany);
router.put('/thresholds', authenticate, requireRole(['Owner / Admin']), updateThresholds);

module.exports = router;
