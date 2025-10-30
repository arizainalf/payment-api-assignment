const db = require('../../config/database'); // mysql2/promise pool

// ✅ Ambil semua banner
const getBanner = async (req, res) => {
  try {
    const [banners] = await db.execute(
      `SELECT banner_name, banner_image, description
       FROM banners
       ORDER BY id DESC`
    );

    if (!banners || banners.length === 0) {
      return res.status(404).json({
        status: 103,
        message: 'Banner tidak ditemukan',
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: banners
    });
  } catch (error) {
    console.error('Banner controller error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null
    });
  }
};

// ✅ Insert banyak banner (tanpa return data)
const createManyBanners = async (req, res) => {
  try {
    const { banners } = req.body;

    if (!banners || !Array.isArray(banners) || banners.length === 0) {
      return res.status(400).json({
        status: 101,
        message: 'Data banners harus berupa array dan tidak boleh kosong',
        data: null
      });
    }

    // Validasi isi tiap objek banner
    for (const banner of banners) {
      if (!banner.banner_name || !banner.banner_image) {
        return res.status(400).json({
          status: 102,
          message: 'banner_name dan banner_image wajib diisi',
          data: null
        });
      }
    }

    // Siapkan query dan values untuk prepared statement
    const values = banners.map(b => [
      b.banner_name,
      b.banner_image,
      b.description || null
    ]);

    const [result] = await db.query(
      `INSERT IGNORE INTO banners (banner_name, banner_image, description, created_at, updated_at)
       VALUES ?`,
      [values.map(v => [...v, new Date(), new Date()])]
    );

    return res.status(201).json({
      status: 0,
      message: `Sukses membuat ${result.affectedRows} banner`,
      data: { count: result.affectedRows }
    });
  } catch (error) {
    console.error('Create many banners error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null
    });
  }
};

// ✅ Insert banyak banner (dengan return data yang baru dibuat)
const createManyBannersWithReturn = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { banners } = req.body;

    if (!banners || !Array.isArray(banners) || banners.length === 0) {
      return res.status(400).json({
        status: 101,
        message: 'Data banners harus berupa array dan tidak boleh kosong',
        data: null
      });
    }

    await conn.beginTransaction();

    const created = [];

    for (const banner of banners) {
      if (!banner.banner_name || !banner.banner_image) {
        await conn.rollback();
        return res.status(400).json({
          status: 102,
          message: 'banner_name dan banner_image wajib diisi',
          data: null
        });
      }

      const [result] = await conn.execute(
        `INSERT INTO banners (banner_name, banner_image, description, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [banner.banner_name, banner.banner_image, banner.description || null]
      );

      const [inserted] = await conn.execute(
        `SELECT id, banner_name, banner_image, description, created_at
         FROM banners WHERE id = ?`,
        [result.insertId]
      );

      created.push(inserted[0]);
    }

    await conn.commit();

    return res.status(201).json({
      status: 0,
      message: `Sukses membuat ${created.length} banner`,
      data: created
    });
  } catch (error) {
    await conn.rollback();
    console.error('Create many banners with return error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan server',
      data: null
    });
  } finally {
    conn.release();
  }
};

module.exports = {
  getBanner,
  createManyBanners,
  createManyBannersWithReturn
};
