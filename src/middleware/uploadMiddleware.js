const multer = require('multer');
const path = require('path');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    const err = new Error('INVALID_IMAGE_FORMAT');
    err.statusCode = 400;
    return cb(err);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const handleUpload = (req, res, next) => {
  const singleUpload = upload.single('profile_image');
  singleUpload(req, res, (err) => {
    if (err) {
      const message =
        err.message === 'INVALID_IMAGE_FORMAT'
          ? 'Format Image tidak sesuai'
          : err.code === 'LIMIT_FILE_SIZE'
          ? 'Ukuran file terlalu besar (maks. 2MB)'
          : 'Terjadi kesalahan saat upload gambar';

      return res.status(400).json({
        status: 102,
        message,
        data: null,
      });
    }
    next();
  });
};

module.exports = handleUpload;
