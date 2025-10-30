// server.js
const env = require('./config/env');
const app = require('./src/app');

const server = app.listen(env.port || 8080, () => {
  if (env.isDevelopment) {
    console.log(`Server berjalan di port ${env.port}`);
    console.log(`Environment: ${env.env}`);
    console.log(`Health check: http://localhost:${env.port}/health`);
    console.log('Log level: Debug');
    console.log('Database:', env.database.url);
  }
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close();
  server.close(() => {
    console.log('Process terminated');
  });
});