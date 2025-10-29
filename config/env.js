// config/env.js
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const getRequiredEnv = (key) => {
  if (env === 'production' && !process.env[key]) {
    throw new Error(`Environment variable ${key} is required in production`);
  }
  return process.env[key];
};

const config = {
  development: {
    database: {
      url: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/dev_db',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev-secret-key-for-development-only',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    port: process.env.PORT || 3000,
    logLevel: 'debug',
  },
  production: {
    database: {
      url: getRequiredEnv('DATABASE_URL'),
    },
    jwt: {
      secret: getRequiredEnv('JWT_SECRET'),
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    port: process.env.PORT || 3000,
    logLevel: 'error',
  },
};

const currentConfig = config[env];

if (!currentConfig) {
  throw new Error(`Unsupported NODE_ENV: ${env}`);
}

module.exports = {
  ...currentConfig,
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',
};