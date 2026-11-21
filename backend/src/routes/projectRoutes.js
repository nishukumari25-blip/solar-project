const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, closeProject } = require('../controllers/projectController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);
// Closure strictly requires Owner / Admin
router.post('/:id/close', authenticate, requireRole(['Owner / Admin']), closeProject);

module.exports = router;
