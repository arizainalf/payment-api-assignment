const env = require('../config/env');
const express = require('express');
const { authenticate } = require('./middleware/authMiddleware')
const { register, login } = require('./controllers/authController');
const { getServices, createManyServices } = require('./controllers/serviceController');
const { getProfile, updateProfile, updateProfileImage } = require('./controllers/profileController');
const { getBanner, createManyBanners } = require('./controllers/bannerController');
const { getBalance, topUp, createTransaction, getTransactionHistory } = require('./controllers/transactionController');

const { validateRegister, validateLogin } = require('./validators/authValidator');
const { validateUpdateProfile } = require('./validators/profileValidator');
const { validateTopUp, validateTransaction, validateTransactionHistory } = require('./validators/transactionValidator');

const handleUpload = require('./middleware/uploadMiddleware');

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

app.post('/register', validateRegister, register);
app.post('/login', validateLogin, login);

app.get('/profile', authenticate, getProfile);
app.put( '/profile/update', authenticate, validateUpdateProfile, updateProfile );

app.put('/profile/image', authenticate, handleUpload, updateProfileImage);

app.get('/banner', getBanner );
app.post('/banner/bulk', createManyBanners );

app.get('/services', authenticate, getServices);
app.post('/services/bulk', authenticate, createManyServices);

app.get('/balance', authenticate, getBalance);

app.post('/topup', authenticate, validateTopUp, topUp);

app.post('/transaction', authenticate, validateTransaction, createTransaction);

app.get('/transaction/history', authenticate, validateTransactionHistory, getTransactionHistory);

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