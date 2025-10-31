const db = require("../../config/database");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../public/uploads");

const getProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const [rows] = await db.execute(
      `SELECT email, first_name, last_name, profile_image 
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 103,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const user = rows[0];
    const profile = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image_url: user.profile_image
        ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_image}`
        : null,
    };

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: profile,
    });
  } catch (error) {
    console.error("Profile controller error:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id: currentUserId } = req.user;
    const { first_name, last_name } = req.validatedData;

    const fields = [];
    const values = [];

    if (first_name !== undefined) {
      fields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push("last_name = ?");
      values.push(last_name);
    }

    values.push(currentUserId);

    await db.execute(
      `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      values
    );

    const [updatedRows] = await db.execute(
      `SELECT email, first_name, last_name, profile_image
       FROM users WHERE id = ? LIMIT 1`,
      [currentUserId]
    );

    const updatedUser = updatedRows[0];

    const responseData = {};
    if (first_name !== undefined)
      responseData.first_name = updatedUser.first_name;
    if (last_name !== undefined) responseData.last_name = updatedUser.last_name;
    responseData.email = updatedUser.email;
    if (responseData.profile_image != null ) {
      responseData.profile_image = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${updatedUser.profile_image}`;
    } else {
      responseData.profile_image = updatedUser.profile_image;
      console.log(responseData.profile_image)
    }

    return res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: responseData,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat memperbarui profil",
      data: null,
    });
  }
};

const updateProfileImage = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id: currentUserId } = req.user;

    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: "Field file tidak boleh kosong",
        data: null,
      });
    }

    await conn.beginTransaction();

    const [oldRows] = await conn.execute(
      `SELECT email, first_name, last_name, profile_image FROM users WHERE id = ? LIMIT 1`,
      [currentUserId]
    );

    const oldImage = oldRows[0]?.profile_image;

    await conn.execute(
      `UPDATE users SET profile_image = ?, updated_at = NOW() WHERE id = ?`,
      [req.file.filename, currentUserId]
    );

    await conn.commit();

    if (oldImage) {
      const oldPath = path.join(uploadDir, oldImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    oldRows[0].profile_image = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: oldRows[0],
    });
  } catch (error) {
    await conn.rollback();

    console.error("Update profile image error:", error);

    if (req.file) {
      const tempPath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }

    return res.status(500).json({
      status: 400,
      message: "Terjadi kesalahan saat mengupload foto profil",
      data: null,
    });
  } finally {
    conn.release();
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
};
