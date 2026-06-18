const AppError = require('../../utils/appError');
const signToken = require('../../utils/signToken');
const verifyToken = require('../../utils/verifyToken');
const sendTokens = require('../../utils/sendTokens');

class AuthController {
  constructor(authService) {
    this.authService = authService;

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.verifyPasswordResetOtp = this.verifyPasswordResetOtp.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.sendOtp = this.sendOtp.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.getMe = this.getMe.bind(this);
  }

  async signup(req, res, next) {
    const data = req.body;

    await this.authService.signup(data);

    res.status(201).json({
      status: 'success',
      message: 'Account created. OTP sent to your email.',
    });
  }

  async login(req, res, next) {
    const data = req.body;

    const { user, token, refreshToken } = await this.authService.login(data);

    sendTokens(res, 200, user, token, refreshToken);
  }

  async refreshToken(req, res, next) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }

    const decoded = await verifyToken(refreshToken);

    const token = signToken(decoded.id);

    res.status(200).json({
      status: 'success',
      token: token,
    });
  }

  logout(req, res, next) {
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success' });
  }

  async forgotPassword(req, res, next) {
    const data = req.body;

    await this.authService.forgotPassword(data);

    res.status(200).json({
      status: 'success',
      message: 'Otp sent to your email',
    });
  }

  async verifyPasswordResetOtp(req, res, next) {
    const data = req.body;

    const resetToken = await this.authService.verifyPasswordResetOtp(data);

    res.status(200).json({
      status: 'success',
      token: resetToken,
      message: 'Your OTP is correct, you can now reset your password',
    });
  }

  async resetPassword(req, res, next) {
    const resetToken = req.params.token;
    const data = req.body;

    const { updatedUser, token, refreshToken } =
      await this.authService.resetPassword(resetToken, data);

    sendTokens(res, 200, updatedUser, token, refreshToken);
  }

  async updatePassword(req, res, next) {
    const userId = req.user.id;
    const data = req.body;

    const { updatedUser, token, refreshToken } =
      await this.authService.updatePassword(userId, data);

    sendTokens(res, 200, updatedUser, token, refreshToken);
  }

  async sendOtp(req, res, next) {
    const data = req.body;

    await this.authService.sendOtp(data);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to your email',
    });
  }

  async verifyOtp(req, res, next) {
    const data = req.body;

    const { updatedUser, token, refreshToken } =
      await this.authService.verifyOtp(data);

    sendTokens(res, 200, updatedUser, token, refreshToken);
  }

  async googleLogin(req, res, next) {
    const data = req.body;
    const { user, token, refreshToken } =
      await this.authService.googleLogin(data);

    sendTokens(res, 200, user, token, refreshToken);
  }

  async getMe(req, res, next) {
    const userId = req.user.id;

    const user = await this.authService.getMe(userId);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  }
}

module.exports = AuthController;
