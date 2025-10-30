const prisma = require('../../config/database');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');

const getProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                email: true,
                first_name: true,
                last_name: true,
                profile_image: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 103,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        const profile = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image_url: user.profile_image
                ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_image}`
                : null
        };

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: profile
        });
    } catch (error) {
        console.error('Profile controller error:', error);
        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan server',
            data: null
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id: currentUserId } = req.user;
        const { first_name, last_name, email } = req.validatedData;

        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser && existingUser.id !== currentUserId) {
                return res.status(409).json({
                    status: 104,
                    message: 'Email sudah digunakan oleh pengguna lain',
                    data: null
                });
            }
        }

        const updateData = {};
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (email !== undefined) updateData.email = email;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: 102,
                message: 'Tidak ada data yang diupdate',
                data: null
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: currentUserId },
            data: updateData,
            select: {
                email: true,
                first_name: true,
                last_name: true,
                profile_image: true,
            }
        });

        const responseData = {
            ...updatedUser,
            profile_image_url: updatedUser.profile_image
                ? `${req.protocol}://${req.get('host')}/uploads/${updatedUser.profile_image}`
                : null
        };

        return res.status(200).json({
            status: 0,
            message: 'Update Profile berhasil',
            data: responseData
        });
    } catch (error) {
        console.error('Update profile error:', error);

        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat memperbarui profil',
            data: null
        });
    }
};

const updateProfileImage = async (req, res) => {
    try {
        const { id: currentUserId } = req.user;

        // Pastikan file diupload
        if (!req.file) {
            return res.status(400).json({
                status: 102,
                message: 'File gambar wajib diupload',
                data: null
            });
        }

        // Ambil data user lama untuk hapus gambar sebelumnya
        const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { profile_image: true }
        });

        // Update hanya profile_image
        const updatedUser = await prisma.user.update({
            where: { id: currentUserId },
            data: {
                profile_image: req.file.filename
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                profile_image: true,
                updated_at: true
            }
        });

        // Hapus gambar lama jika ada
        if (currentUser?.profile_image) {
            const oldImagePath = path.join(uploadDir, currentUser.profile_image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const responseData = {
            ...updatedUser,
            profile_image_url: updatedUser.profile_image
                ? `${req.protocol}://${req.get('host')}/uploads/${updatedUser.profile_image}`
                : null
        };

        return res.status(200).json({
            status: 0,
            message: 'Foto profil berhasil diperbarui',
            data: responseData
        });
    } catch (error) {
        console.error('Update profile image error:', error);

        // Hapus file sementara jika error
        if (req.file) {
            const tempPath = path.join(uploadDir, req.file.filename);
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }

        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengupload foto profil',
            data: null
        });
    }
};

const getBalance = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                balance: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 103,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: user
        });
    } catch (error) {
        console.error('Profile controller error:', error);
        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan server',
            data: null
        });
    }
}

module.exports = {
    getProfile,
    getBalance,
    updateProfile,
    updateProfileImage
};