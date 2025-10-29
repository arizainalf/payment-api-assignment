// src/controllers/profileController.js
const prisma = require('../../config/database');

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

        // Gabungkan nama jika ingin tampilkan 'name'
        const profile = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            name: [user.first_name, user.last_name].filter(Boolean).join(' ') || null,
            created_at: user.created_at
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

module.exports = {
    getProfile
};