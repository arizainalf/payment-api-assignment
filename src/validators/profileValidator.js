// src/validators/profileValidator.js
const { z } = require('zod');

const nameRegex = /^[a-zA-Z\s]+$/;

const updateProfileSchema = z.object({
    first_name: z.string()
        .min(3, { message: 'Nama depan minimal 3 karakter' })
        .max(100, { message: 'Nama depan maksimal 100 karakter' })
        .regex(nameRegex, { message: 'Nama depan hanya boleh huruf dan spasi' })
        .trim()
        .optional(),

    last_name: z.string()
        .min(1, { message: 'Nama belakang minimal 1 karakter' })
        .max(100, { message: 'Nama belakang maksimal 100 karakter' })
        .regex(nameRegex, { message: 'Nama belakang hanya boleh huruf dan spasi' })
        .trim()
        .optional(),

    email: z.string()
        .email({ message: 'Parameter email tidak sesuai format' })
        .min(1, { message: 'Email harus diisi' })
        .max(255, { message: 'Email terlalu panjang' })
        .toLowerCase()
        .trim()
        .optional(),
});

const validateRequest = (schema) => {
    return (req, res, next) => {
        // Validasi body JSON (tanpa file)
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                status: 102,
                message: 'Data harus berupa objek JSON',
                data: null
            });
        }

        try {
            // Parse hanya field yang diizinkan
            const validatedData = schema.parse(req.body);
            req.validatedData = validatedData;
            next();
        } catch (error) {
            if (error.name === 'ZodError' && Array.isArray(error.issues)) {
                const errorDetails = error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));
                return res.status(400).json({
                    status: 102,
                    message: errorDetails,
                    data: null
                });
            }
            return res.status(400).json({
                status: 102,
                message: 'Data tidak valid',
                data: null
            });
        }
    };
};

module.exports = {
    validateUpdateProfile: validateRequest(updateProfileSchema)
};