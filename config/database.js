// config/database.js
const { PrismaClient } = require('@prisma/client');
const env = require('./env');

const prisma = new PrismaClient({
    log: env.isDevelopment
        ? ['query', 'error', 'warn']
        : ['error']
});

module.exports = prisma;