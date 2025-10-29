const express = require('express');
const { getBanner } = require('../controllers/bannerController');

const router = express.Router();

router.get('/', getBanner);

module.exports = router;