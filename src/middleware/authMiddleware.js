const { verifyToken } = require('../utils/jwt');
const prisma = require('../../config/database');

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true
      }
    });

    if (!user) {
      return res.status(401).json({
        status: 108,
        message: 'User tidak ditemukan',
        data: null
      });
    }

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