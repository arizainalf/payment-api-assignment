const express = require('express');
const { getServices, createManyServices } = require('../controllers/serviceController');
const {authenticate } = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/', authenticate, getServices);
router.post('/bulk', authenticate, createManyServices)

module.exports = router;