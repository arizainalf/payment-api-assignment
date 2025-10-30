const express = require('express');

const { getBanner, createManyBanners } = require('../controllers/bannerController');
const router = express.Router();

router.get('/', getBanner);
router.post('/bulk', createManyBanners)

module.exports = router;