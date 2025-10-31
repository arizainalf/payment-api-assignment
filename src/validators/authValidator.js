const { z } = require("zod");

const nameRegex = /^[a-zA-Z\s]+$/;

const registerSchema = z
  .object({
    email: z
      .string({
        required_error: "Parameter email harus di isi",
      })
      .min(1,{message: "Parameter email harus di isi"})
      .email({ message: "Parameter email tidak sesuai format" })
      .toLowerCase()
      .trim(),

    first_name: z
      .string({
        required_error: "Parameter first_name harus di isi",
      })
      .min(1, { message: "Parameter first_name harus di isi" })
      .max(100, { message: "Parameter first_name maksimal 100 karakter" })
      .regex(nameRegex, { message: "Nama depan hanya boleh huruf dan spasi" })
      .trim(),

    last_name: z
      .string({
        required_error: "Parameter last_name harus di isi",
      })
      .trim()
      .min(1, { message: "Parameter last_name harus di isi" })
      .max(100, { message: "Parameter last_name maksimal 100 karakter" })
      .regex(nameRegex, {
        message: "Nama belakang hanya boleh huruf dan spasi",
      }),

    password: z
      .string({
        required_error: "Parameter password harus di isi",
      })
      .min(8, { message: "Password length minimal 8 karakter" })
      .max(20, { message: "Password length maksimal 20 karakter" }),
  })
  .refine(
    (data) => {
      const pass = data.password.toLowerCase();
      const first = data.first_name.toLowerCase();
      const last = data.last_name?.toLowerCase() || "";
      const full = `${first} ${last}`.trim();
      return pass !== first && pass !== full && (last ? pass !== last : true);
    },
    {
      message: "Password tidak boleh sama dengan nama Anda",
      path: ["password"],
    }
  );

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Parameter email harus di isi",
    })
    .min(1,{message:"Parameter email harus di isi"})
    .email({ message: "Parameter email tidak sesuai format" })
    .toLowerCase()
    .trim(),

  password: z
    .string({
      required_error: "Parameter password harus di isi",
    })
    .min(1, { message: "Parameter password harus di isi" }),
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
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error.name === "ZodError" && Array.isArray(error.issues)) {
        const firstIssue = { ...error.issues[0] };

        if (
          firstIssue.code === "invalid_type" ||
          firstIssue.received === "undefined" ||
          firstIssue.expected === "string"
        ) {
          const requiredMessages = {
            first_name: "Parameter first_name harus di isi",
            last_name: "Parameter last_name harus di isi",
            email: "Parameter email harus di isi",
            password: "Parameter password harus di isi",
          };
          const field = firstIssue.path[0];
          if (field && requiredMessages[field]) {
            firstIssue.message = requiredMessages[field];
          }
        }

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
  validateRegister: validateRequest(registerSchema),
  validateLogin: validateRequest(loginSchema),
};
