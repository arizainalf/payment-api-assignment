const { z } = require('zod');

const topUpSchema = z.object({
    top_up_amount: z.number({
        required_error: 'Parameter top_up_amount harus diisi',
        invalid_type_error: 'Parameter top_up_amount harus berupa angka'
    })
        .positive({ message: 'Parameter amount tidak boleh lebih kecil dari 0' })
        .int({ message: 'Parameter amount hanya boleh angka bulat' })
});

const transactionSchema = z.object({
    service_code: z.string()
        .min(1, { message: 'Parameter service_code harus diisi' })
        .max(50, { message: 'Parameter service_code terlalu panjang' })
        .trim()
});

const transactionHistorySchema = z.object({
    offset: z.string()
        .regex(/^\d+$/, { message: 'Parameter offset harus berupa angka' })
        .transform(Number)
        .refine(val => val >= 0, { message: 'Parameter offset tidak boleh negatif' })
        .optional()
        .default('0'),
    limit: z.string()
        .regex(/^\d+$/, { message: 'Parameter limit harus berupa angka' })
        .transform(Number)
        .refine(val => val > 0, { message: 'Parameter limit harus lebih besar dari 0' })
        .optional()
});

const validateQuery = (schema) => {
    return (req, res, next) => {
        if (!req.query || typeof req.query !== 'object') {
            return res.status(400).json({
                status: 102,
                message: 'Query parameters tidak valid',
                data: null
            });
        }

        try {
            const validatedData = schema.parse(req.query);
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

            console.error('Non-Zod validation error:', error);
            return res.status(400).json({
                status: 102,
                message: 'Data tidak valid',
                data: null
            });
        }
    };
};

const validateRequest = (schema) => {

    return (req, res, next) => {
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
            if (error.name === 'ZodError' && Array.isArray(error.issues)) {
                const combinedMessage = error.issues
                    .map(issue => issue.message)
                    .join(', ');

                return res.status(400).json({
                    status: 102,
                    message: combinedMessage,
                    data: null
                });
            }

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
    validateTopUp: validateRequest(topUpSchema),
    validateTransaction: validateRequest(transactionSchema),
    validateTransactionHistory: validateQuery(transactionHistorySchema)
};