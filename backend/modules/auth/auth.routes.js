const express = require('express');

const protect = require('../../middlewares/protect');

const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');

const {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  emailSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} = require('./auth.validation');

const prisma = require('../../db');
const AuthRepository = require('./auth.repository');
const AuthService = require('./auth.service');
const AuthController = require('./auth.controller');

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const router = express.Router();

router.post(
  '/signup',
  validate({ body: signupSchema }),
  catchAsync(authController.signup),
);

router.post(
  '/login',
  validate({ body: loginSchema }),
  catchAsync(authController.login),
);

router.post('/logout', authController.logout);

router.post('/refreshToken', catchAsync(authController.refreshToken));

router.post(
  '/sendOtp',
  validate({ body: emailSchema }),
  catchAsync(authController.sendOtp),
);

router.post(
  '/verifyOtp',
  validate({ body: verifyOtpSchema }),
  catchAsync(authController.verifyOtp),
);

router.post(
  '/forgotPassword',
  validate({ body: emailSchema }),
  catchAsync(authController.forgotPassword),
);

router.post(
  '/verifyPasswordResetOtp',
  validate({ body: verifyOtpSchema }),
  catchAsync(authController.verifyPasswordResetOtp),
);

router.post(
  '/resetPassword/:token',
  validate({ body: resetPasswordSchema }),
  catchAsync(authController.resetPassword),
);

router.post(
  '/updateMyPassword',
  catchAsync(protect),
  validate({ body: updatePasswordSchema }),
  catchAsync(authController.updatePassword),
);

router.post('/googleLogin', catchAsync(authController.googleLogin));

router.get('/getMe', catchAsync(protect), catchAsync(authController.getMe));

module.exports = router;
