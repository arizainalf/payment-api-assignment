const pool = require('../../config/database');
const env = require('../../config/env');

function generateInvoiceNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV${dateStr}-${randomNum}`;
}

// ==========================
// GET BALANCE
// ==========================
const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      'SELECT balance FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 103,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    return res.json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: { balance: rows[0].balance },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });
  }
};

// ==========================
// TOP UP
// ==========================
const topUp = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { top_up_amount } = req.validatedData;
    const userId = req.user.id;

    if (!top_up_amount || top_up_amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        data: null,
      });
    }

    await connection.beginTransaction();

    // Update saldo user
    await connection.execute(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [top_up_amount, userId]
    );

    // Generate invoice
    const invoiceNumber = generateInvoiceNumber();

    // Insert transaksi topup
    await connection.execute(
      `INSERT INTO transactions 
        (invoice_number, user_id, transaction_type, description, total_amount) 
       VALUES (?, ?, 'TOPUP', 'Top Up balance', ?)`,
      [invoiceNumber, userId, top_up_amount]
    );

    // Ambil saldo baru
    const [result] = await connection.execute(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );

    await connection.commit();

    return res.json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: { balance: result[0].balance },
    });
  } catch (error) {
    await connection.rollback();
    console.error('TopUp error:', error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });
  } finally {
    connection.release();
  }
};

// ==========================
// CREATE TRANSACTION (PAYMENT)
// ==========================
const createTransaction = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { service_code } = req.validatedData;
    const userId = req.user.id;

    await connection.beginTransaction();

    // Ambil service
    const [serviceRows] = await connection.execute(
      'SELECT * FROM services WHERE service_code = ? LIMIT 1',
      [service_code]
    );

    if (serviceRows.length === 0) {
      throw new Error('SERVICE_NOT_FOUND');
    }
    const service = serviceRows[0];

    // Ambil user
    const [userRows] = await connection.execute(
      'SELECT balance FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (userRows.length === 0) throw new Error('USER_NOT_FOUND');
    const user = userRows[0];

    // Cek saldo
    if (user.balance < service.service_tariff) {
      throw new Error('INSUFFICIENT_BALANCE');
    }

    // Kurangi saldo user
    await connection.execute(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [service.service_tariff, userId]
    );

    // Buat transaksi baru
    const invoiceNumber = generateInvoiceNumber();
    await connection.execute(
      `INSERT INTO transactions 
        (invoice_number, user_id, service_code, transaction_type, description, total_amount)
       VALUES (?, ?, ?, 'PAYMENT', ?, ?)`,
      [
        invoiceNumber,
        userId,
        service_code,
        service.service_name,
        service.service_tariff,
      ]
    );

    await connection.commit();

    return res.json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: service.service_tariff,
        created_on: new Date(),
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error('Transaction error:', error.message);

    if (error.message === 'SERVICE_NOT_FOUND') {
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null,
      });
    }

    if (error.message === 'INSUFFICIENT_BALANCE') {
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null,
      });
    }

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        status: 103,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });
  } finally {
    connection.release();
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { offset = 0, limit } = req.query;
    const userId = req.user.id;

    const offsetNum = parseInt(offset) || 0;
    const limitNum = limit ? parseInt(limit) : 50;

    console.log('Query:', offsetNum);
    console.log('Params:', limitNum);
    console.log('User Id:', userId);

    const [transactions] = await pool.query(
        `
    SELECT invoice_number, transaction_type, description, total_amount, created_on
    FROM transactions
    WHERE user_id = ?
    ORDER BY created_on DESC
    LIMIT ${limitNum} OFFSET ${offsetNum}
    `,
      [userId]
    );


    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM transactions WHERE user_id = ?',
      [userId]
    );

    return res.json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: offsetNum,
        limit: limitNum,
        total_records: total,
        records: transactions,
      },
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server' + error,
      data: null,
    });
  }
};

module.exports = {
  getBalance,
  topUp,
  createTransaction,
  getTransactionHistory,
};
