// src/app.js
const env = require('../config/env'); // Pastikan path benar!
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Development-only logging
if (env.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes)
app.use('/api/banner', bannerRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: `Server is running in ${env.env} mode`,
    timestamp: new Date().toISOString(),
    environment: env.env
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
    response.stack = error.stack;
  }

  res.status(500).json(response);
});

module.exports = app;