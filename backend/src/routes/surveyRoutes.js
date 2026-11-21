const express = require('express');
const router = express.Router();
const { getSurveys, createSurvey } = require('../controllers/surveyController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getSurveys);
router.post('/', authenticate, requireRole(['Survey Engineer', 'Sales Executive']), createSurvey);

module.exports = router;
