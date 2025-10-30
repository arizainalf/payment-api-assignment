const env = require('../config/env');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes)
app.use('/api/banner', bannerRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/transaction', transactionRoutes)

app.get('/health', (req, res) => {
  // Ambil semua routes yang terdaftar
  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes langsung di app
      const method = Object.keys(middleware.route.methods)[0].toUpperCase();
      routes.push({ method, path: middleware.route.path });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Routes di dalam router (misal /api/auth, /api/profile)
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          const method = Object.keys(route.methods)[0].toUpperCase();
          // Gabungkan base path router + path-nya
          const baseUrl = middleware.regexp?.toString().match(/^\/\^\\\/(.+?)\\\//)?.[1] || '';
          routes.push({
            method,
            path: `/${baseUrl}${route.path === '/' ? '' : route.path}`,
          });
        }
      });
    }
  });

  res.json({
    success: true,
    message: `Server is running`,
    timestamp: new Date().toISOString(),
    environment: env.env,
    isDevelopment: env.isDevelopment,
    totalRoutes: routes.length,
    routes,
  });
});


app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);

  const response = {
    success: false,
    message: 'Terjadi kesalahan server'
  };

  if (env.isDevelopment) {
    response.error = error.message;
    response.stack = error.stack; // ← 🔴 error di sini!
  }

  res.status(500).json(response);
});

module.exports = app;