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
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME || 'dev_db',
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
      host: getRequiredEnv('DB_HOST'),
      port: getRequiredEnv('DB_PORT'),
      user: getRequiredEnv('DB_USER'),
      password: getRequiredEnv('DB_PASSWORD'),
      name: getRequiredEnv('DB_NAME'),
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
