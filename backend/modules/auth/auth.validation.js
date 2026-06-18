const { z } = require('zod');

const signupSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    passwordConfirm: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Password and passwordConfirm must be the same',
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

const emailSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6).max(100),
    passwordConfirm: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Password and passwordConfirm must be the same',
  });

const updatePasswordSchema = z
  .object({
    passwordCurrent: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    passwordConfirm: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Password and passwordConfirm must be the same',
  });

module.exports = {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  emailSchema,
  resetPasswordSchema,
  updatePasswordSchema,
};
