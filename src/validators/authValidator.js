// src/validators/authValidator.js
const { z } = require('zod');

const nameRegex = /^[a-zA-Z\s]+$/;

const registerSchema = z.object({
    first_name: z.string()
        .min(3, { message: 'Nama depan minimal 3 karakter' })
        .max(100, { message: 'Nama depan maksimal 100 karakter' })
        .regex(nameRegex, { message: 'Nama depan hanya boleh huruf dan spasi' })
        .trim(),

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
        .trim(),

    password: z.string()
        .min(6, { message: 'Password minimal 6 karakter' })
        .max(100, { message: 'Password maksimal 100 karakter' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: 'Password harus mengandung huruf kecil, huruf besar, dan angka'
        })
}).refine(
    (data) => {
        const pass = data.password.toLowerCase();
        const first = data.first_name.toLowerCase();
        const last = data.last_name?.toLowerCase() || '';
        const full = `${first} ${last}`.trim();
        return pass !== first && pass !== full && (last ? pass !== last : true);
    },
    {
        message: 'Password tidak boleh sama dengan nama Anda',
        path: ['password']
    }
);

const loginSchema = z.object({
    email: z.string()
        .email({ message: 'Format email tidak valid' })
        .min(1, { message: 'Email harus diisi' })
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(1, { message: 'Password harus diisi' })
});

// ✅ Validator middleware yang kompatibel dengan Zod v4
const validateRequest = (schema) => {
    return (req, res, next) => {
        // Pastikan body adalah objek
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
            return res.status(400).json({
                status: 102,
                message: 'Body harus berupa objek JSON',
                data: null
            });
        }

        try {
            const validatedData = schema.parse(req.body);
            req.validatedData = validatedData;
            next();
        } catch (error) {
            // ✅ PENANGANAN ERROR YANG BENAR UNTUK ZOD v4
            if (error.name === 'ZodError' && Array.isArray(error.issues)) {
                const errorDetails = error.issues.map(issue => ({
                    field: issue.path.join('.'), // misal: "first_name"
                    message: issue.message       // pesan kustom dari schema
                }));

                return res.status(400).json({
                    status: 102,
                    message: errorDetails,
                    data: null
                });
            }

            // Error tak terduga
            console.error('Non-Zod validation error:', error);
            return res.status(400).json({
                status: 102,
                message: 'Data tidak valid',
                data: null
            });
        }
    };
};

module.exports = {
    validateRegister: validateRequest(registerSchema),
    validateLogin: validateRequest(loginSchema)
};