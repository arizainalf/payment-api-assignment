const pool = require('../../config/database');

const getServices = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT service_code, service_name, service_icon, service_tariff 
       FROM services`
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        status: 103,
        message: 'Service tidak ditemukan',
        data: null,
      });
    }

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: rows,
    });
  } catch (error) {
    console.error('Service controller error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });
  }
};

const createManyServices = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { services } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        status: 101,
        message: 'Data services harus berupa array dan tidak boleh kosong',
        data: null,
      });
    }

    for (let service of services) {
      if (!service.service_code || !service.service_name) {
        return res.status(400).json({
          status: 102,
          message: 'service_code dan service_name wajib diisi',
          data: null,
        });
      }
    }

    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO services (service_code, service_name, service_icon, service_tariff, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        service_name = VALUES(service_name),
        service_icon = VALUES(service_icon),
        service_tariff = VALUES(service_tariff),
        updated_at = NOW()
    `;

    let count = 0;

    for (const s of services) {
      const params = [
        s.service_code,
        s.service_name,
        s.service_icon || '',
        s.service_tariff || 0,
      ];

      await connection.execute(insertQuery, params);
      count++;
    }

    await connection.commit();

    return res.status(201).json({
      status: 0,
      message: `Sukses membuat atau memperbarui ${count} service`,
      data: { count },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create many services error:', error);

    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null,
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getServices,
  createManyServices,
};
