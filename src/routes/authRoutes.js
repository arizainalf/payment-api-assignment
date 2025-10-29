// src/routes/authRoutes.js
const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const {
    validateRegister,
    validateLogin
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;