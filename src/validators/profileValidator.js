const { z } = require("zod");

const nameRegex = /^[a-zA-Z\s]+$/;

const updateProfileSchema = z.object({
  first_name: z
    .string({
      require_error: "Parameter first_name harus di isi",
    })
    .min(1, { message: "Parameter first_name harus di isi" })
    .max(100, { message: "Parameter first_name maksimal 100 karakter" })
    .regex(nameRegex, { message: "Nama depan hanya boleh huruf dan spasi" })
    .trim(),

  last_name: z
    .string({
      require_error: "Parameter last_name harus di isi",
    })
    .min(1, { message: "Parameter last_name harus di isi" })
    .max(100, { message: "Nama belakang maksimal 100 karakter" })
    .regex(nameRegex, { message: "Nama belakang hanya boleh huruf dan spasi" })
    .trim(),
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        status: 102,
        message: "Body harus berupa objek JSON",
        data: null,
      });
    }

    try {
      // ✅ PARSE DAN SIMPAN HASILNYA
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData; // <-- INI YANG WAJIB!
      next();
    } catch (error) {
        console.log('erorr', error)
      if (error.name === "ZodError" && Array.isArray(error.issues)) {
        const firstIssue = { ...error.issues[0] };

        // Handle error "received: undefined" agar pakai pesan required
        if (
          firstIssue.code === "invalid_type" ||
          firstIssue.received === "undefined" ||
          firstIssue.expected === "string"
        ) {
          const requiredMessages = {
            first_name: "Parameter first_name harus di isi",
            last_name: "Parameter last_name harus di isi",
          };
          const field = firstIssue.path[0];
          if (typeof field === "string" && requiredMessages[field]) {
            firstIssue.message = requiredMessages[field];
          }
        }

        console.warn("Validation issues:", error.issues);

        return res.status(400).json({
          status: 102,
          message: firstIssue.message,
          data: null,
        });
      }

      console.error("Non-Zod validation error:", error);
      return res.status(400).json({
        status: 102,
        message: "Data tidak valid",
        data: null,
      });
    }
  };
};

module.exports = {
  validateUpdateProfile: validateRequest(updateProfileSchema),
};
