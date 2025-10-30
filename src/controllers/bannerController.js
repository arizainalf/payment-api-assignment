const prisma = require('../../config/database');

const getBanner = async (req, res) => {
    try {
        const banner = await prisma.banner.findMany({
            select: {
                banner_name: true,
                banner_image: true,
                description: true,
            }
        });

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
            message: 'Terjadi kesalahan server ' + error,
            data: null
        });
    }
};

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

        for (let banner of banners) {
            if (!banner.banner_name || !banner.banner_image) {
                return res.status(400).json({
                    status: 102,
                    message: 'banner_name dan banner_image wajib diisi',
                    data: null
                });
            }
        }

        const createdBanners = await prisma.banner.createMany({
            data: banners,
            skipDuplicates: true
        });

        return res.status(201).json({
            status: 0,
            message: `Sukses membuat ${createdBanners.count} banner`,
            data: {
                count: createdBanners.count
            }
        });

    } catch (error) {
        console.error('Create many banners error:', error);

        if (error.code === 'P2002') {
            return res.status(400).json({
                status: 104,
                message: 'Banner dengan nama yang sama sudah ada',
                data: null
            });
        }

        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan server',
            data: null
        });
    }
};

const createManyBannersWithReturn = async (req, res) => {
    try {
        const { banners } = req.body;

        if (!banners || !Array.isArray(banners) || banners.length === 0) {
            return res.status(400).json({
                status: 101,
                message: 'Data banners harus berupa array dan tidak boleh kosong',
                data: null
            });
        }

        const result = await prisma.$transaction(
            banners.map(banner =>
                prisma.banner.create({
                    data: banner,
                    select: {
                        id: true,
                        banner_name: true,
                        banner_image: true,
                        description: true,
                        created_at: true
                    }
                })
            )
        );

        return res.status(201).json({
            status: 0,
            message: `Sukses membuat ${result.length} banner`,
            data: result
        });

    } catch (error) {
        console.error('Create many banners with return error:', error);
        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan server',
            data: null
        });
    }
};

module.exports = {
    getBanner,
    createManyBanners,
    createManyBannersWithReturn
};