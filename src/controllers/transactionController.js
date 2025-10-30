const prisma = require('../../config/database');
const { TransactionType } = require('@prisma/client');
const env = require('../../config/env');

function generateInvoiceNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV${dateStr}-${randomNum}`;
}

const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    if (!user) {
      return res.status(404).json({
        status: 103,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    return res.json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: {
        balance: user.balance
      }
    });

  } catch (error) {
    console.error('Get balance error:', error);

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

const topUp = async (req, res) => {
  try {
    const { top_up_amount } = req.validatedData;
    const userId = req.user.id;

    if (!top_up_amount || top_up_amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        data: null
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: top_up_amount
          }
        },
        select: {
          balance: true,
          email: true
        }
      });

      const invoiceNumber = generateInvoiceNumber();
      await tx.transaction.create({
        data: {
          invoice_number: invoiceNumber,
          user_id: userId,
          transaction_type: TransactionType.TOPUP,
          description: 'Top Up balance',
          total_amount: top_up_amount
        }
      });

      return updatedUser;
    });

    if (env.isDevelopment) {
      console.log('💰 Top up successful:', {
        user_id: userId,
        amount: top_up_amount,
        new_balance: result.balance
      });
    }

    return res.json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: result.balance
      }
    });

  } catch (error) {
    console.error('Topup error:', error);

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

const createTransaction = async (req, res) => {
  try {
    const { service_code } = req.validatedData;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: { service_code }
      });

      if (!service) {
        throw new Error('SERVICE_NOT_FOUND');
      }

      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      if (user.balance < service.service_tariff) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: service.service_tariff
          }
        }
      });

      const invoiceNumber = generateInvoiceNumber();
      const transaction = await tx.transaction.create({
        data: {
          invoice_number: invoiceNumber,
          user_id: userId,
          service_code: service_code,
          transaction_type: TransactionType.PAYMENT,
          description: service.service_name,
          total_amount: service.service_tariff
        }
      });

      return {
        transaction,
        service
      };
    });

    if (env.isDevelopment) {
      console.log('🛒 Transaction successful:', {
        user_id: userId,
        service_code: service_code,
        amount: result.service.service_tariff
      });
    }

    return res.json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: result.transaction.invoice_number,
        service_code: result.service.service_code,
        service_name: result.service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: result.service.service_tariff,
        created_on: result.transaction.created_on
      }
    });

  } catch (error) {
    console.error('Transaction error:', error);

    if (env.isDevelopment) {
      console.error('🔍 Full error details:', error);
    }

    if (error.message === 'SERVICE_NOT_FOUND') {
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    if (error.message === 'INSUFFICIENT_BALANCE') {
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        status: 103,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { offset = 0, limit } = req.query;
    const userId = req.user.id;

    const offsetNum = parseInt(offset) || 0;
    const limitNum = limit ? parseInt(limit) : undefined;

    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId },
      select: {
        invoice_number: true,
        transaction_type: true,
        description: true,
        total_amount: true,
        created_on: true
      },
      orderBy: {
        created_on: 'desc'
      },
      skip: offsetNum,
      take: limitNum
    });

    const totalRecords = await prisma.transaction.count({
      where: { user_id: userId }
    });

    if (env.isDevelopment) {
      console.log('📊 Transaction history fetched:', {
        user_id: userId,
        records_count: transactions.length
      });
    }

    return res.json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: offsetNum,
        limit: limitNum || totalRecords,
        records: transactions
      }
    });

  } catch (error) {
    console.error('Get transaction history error:', error);

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
  getBalance,
  topUp,
  createTransaction,
  getTransactionHistory
};