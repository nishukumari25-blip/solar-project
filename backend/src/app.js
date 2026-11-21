const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const { CORS_ORIGIN } = require('./config/env');

// Route imports
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const crmRoutes = require('./routes/crmRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const grnRoutes = require('./routes/grnRoutes');
const subsidyRoutes = require('./routes/subsidyRoutes');
const financeRoutes = require('./routes/financeRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();

// Middlewares
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? '*' : [CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Solaris EPC Solar ERP Phase 1 API',
    version: '1.0.0',
    hub: 'Jaipur, Rajasthan',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', crmRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/grn', grnRoutes);
app.use('/api/subsidy', subsidyRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint '${req.originalUrl}' not found` });
});

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
