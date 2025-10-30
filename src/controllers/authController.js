const prisma = require('../../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const env = require('../../config/env');

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        status: 102,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
      }
    });

    if (env.isDevelopment) {
      console.log('📝 New user registered:', {
        id: user.id,
        email: user.email,
        first_name: user.first_name
      });
    }

    res.status(201).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null
    });

  } catch (error) {
    console.error('Register error:', error);

    if (env.isDevelopment) {
      console.error('🔍 Full error details:', error);
    }

    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        status: 103,
        message: 'Email atau password salah',
        data: null
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 103,
        message: 'Email atau password salah',
        data: null
      });
    }

    const token = generateToken({ userId: user.id });

    if (env.isDevelopment) {
      console.log('🔑 User logged in:', {
        id: user.id,
        email: user.email
      });
    }

    res.json({
      status: 0,
      message: 'Login sukses',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    if (env.isDevelopment) {
      console.error('🔍 Full error details:', error);
    }

    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null
    });
  }
};

module.exports = {
  register,
  login
};