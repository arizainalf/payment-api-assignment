const express = require('express');
const { getProfile, updateProfile, updateProfileImage, getBalance } = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateUpdateProfile } = require('../validators/profileValidator');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', authenticate, getProfile);
router.get('/balance', authenticate, getBalance);
router.put(
    '/update',
    authenticate,
    validateUpdateProfile,
    updateProfile
);
router.put(
    '/image',
    authenticate,
    upload.single('profile_image'),
    updateProfileImage,
    (error, req, res, next) => {
        if (error) {
            const message = error.message === 'INVALID_IMAGE_FORMAT'
                ? 'Format Image tidak sesuai'
                : 'Terjadi kesalahan saat upload gambar';

            return res.status(400).json({
                status: 102,
                message: message,
                data: null
            })
        }
        next();
    }
);

module.exports = router;