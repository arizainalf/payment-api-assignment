const prisma = require('../../config/database');

const getServices = async (req, res) => {
    try {
        const service = await prisma.service.findMany({
            select: {
                service_code: true,
                service_name: true,
                service_icon: true,
                service_tariff: true,
            }
        });

        if (!service) {
            return res.status(404).json({
                status: 103,
                message: 'Service tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: service
        });
    } catch (error) {
        console.error('Service controller error:', error);
        return res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan server',
            data: null
        });
    }
};

const createManyServices = async (req, res) => {
    try {
        const { services } = req.body;

        if (!services || !Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                status: 101,
                message: 'Data services harus berupa array dan tidak boleh kosong',
                data: null
            });
        }

        for (let service of services) {
            if (!service.service_code || !service.service_name) {
                return res.status(400).json({
                    status: 102,
                    message: 'service_code dan service_name wajib diisi',
                    data: null
                });
            }
        }

        const createdServices = await prisma.service.createMany({
            data: services,
            skipDuplicates: true 
        });

        return res.status(201).json({
            status: 0,
            message: `Sukses membuat ${createdServices.count} service`,
            data: {
                count: createdServices.count
            }
        });

    } catch (error) {
        console.error('Create many services error:', error);

        if (error.code === 'P2002') {
            return res.status(400).json({
                status: 104,
                message: 'Service dengan nama yang sama sudah ada',
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

module.exports = {
    getServices,
    createManyServices,
};