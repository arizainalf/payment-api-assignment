const { verifyToken } = require('../utils/jwt');
const pool = require('../../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak valid atau kadaluwarsa',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak valid',
        data: null
      });
    }

    // Gunakan prepared statement untuk mencegah SQL Injection
    const [rows] = await pool.execute(
      `SELECT id, email, first_name, last_name, profile_image 
       FROM users 
       WHERE id = ? 
       LIMIT 1`,
      [decoded.userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        status: 108,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    const user = rows[0];

    req.user = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image: user.profile_image,
      name: [user.first_name, user.last_name].filter(Boolean).join(' ') || null
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 108,
      message: 'Token tidak valid atau kadaluwarsa',
      data: null
    });
  }
};

module.exports = { authenticate };
