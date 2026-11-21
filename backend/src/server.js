const app = require('./app');
const { connectDB } = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Solaris EPC ERP Backend running in [${NODE_ENV}] mode`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
  });
};

startServer();
