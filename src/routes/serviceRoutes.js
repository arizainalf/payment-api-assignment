const express = require('express');
const {authenticate } = require('../middleware/authMiddleware')

const router = express.Router();

const { getServices, createManyServices } = require('../controllers/serviceController');
router.get('/', authenticate, getServices);
router.post('/bulk', authenticate, createManyServices)

module.exports = router;