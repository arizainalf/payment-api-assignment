const prisma = require('../../config/database');

const getBanner = async (req, res) => {
    try {

        const banner = await prisma.banner.findMany();

        if (!banner) {
            return res.status(404).json({
                status: 103,
                message: 'Banner tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banner
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

module.exports = {
    getBanner,
};