// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
    validateTopUp,
    validateTransaction,
    validateTransactionHistory
} = require('../validators/transactionValidator');
const {
    getBalance,
    topUp,
    createTransaction,
    getTransactionHistory
} = require('../controllers/transactionController');

router.get('/balance', authenticate, getBalance);

router.post('/topup', authenticate, validateTopUp, topUp);

router.post('/', authenticate, validateTransaction, createTransaction);

router.get('/history', authenticate, validateTransactionHistory, getTransactionHistory);

module.exports = router;