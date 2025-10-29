const express = require('express');
const { getProfile } = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');
const {
    validateRegister,
    validateLogin
} = require('../validators/authValidator');

const router = express.Router();

router.get('/', authenticate, getProfile);
router.post('/', authenticate, getProfile);

module.exports = router;