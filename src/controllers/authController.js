const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const env = require('../../config/env');

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.validatedData;

    const [existingUser] = await db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 102,
        message: 'Email sudah terdaftar',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      `INSERT INTO users (email, first_name, last_name, password, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [email, first_name, last_name || null, hashedPassword]
    );

    if (env.isDevelopment) {
      console.log('📝 New user registered:', {
        id: result.insertId,
        email,
        first_name,
      });
    }

    res.status(201).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null,
    });

  } catch (error) {

    console.error('Register error:', error);

    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });

  }
  
};

const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const [rows] = await db.execute(
      'SELECT id, email, password, first_name, last_name FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: 'Email atau password salah',
        data: null,
      });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 103,
        message: 'Email atau password salah',
        data: null,
      });
    }

    const token = generateToken({ userId: user.id });

    if (env.isDevelopment) {
      console.log('🔑 User logged in:', { id: user.id, email: user.email });
    }

    res.json({
      status: 0,
      message: 'Login sukses',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name || ''}`.trim(),
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
};
