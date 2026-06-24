const AppError = require('../../utils/appError');
const sendEmail = require('../../utils/email');
const signToken = require('../../utils/signToken');
const signRefreshToken = require('../../utils/signRefreshToken');
const hashPassword = require('../../utils/hashPassword');
const createPasswordResetToken = require('../../utils/createPasswordResetToken');
const hashToken = require('../../utils/hashToken');
const correctPassword = require('../../utils/correctPassword');
const generateOtp = require('../../utils/generateOtp');
const hashOtp = require('../../utils/hashOtp');
const verifyGoogleToken = require('../../utils/verifyGoogleToken');
const sanitizeUser = require('../../utils/sanitizeUser');
const sanitizeProfileUser = require('../../utils/sanitizeProfileUser');

class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signup(data) {
    const { name, email, password } = data;

    const { otp, hashedOtp, expires } = generateOtp();

    // try {
    //   await sendEmail({
    //     email: 'weehaghamel@gmail.com', //'amjadmhmoud3@gmail.com', // email
    //     subject: 'Your OTP Code (valid for 5 minutes)',
    //     message: `Your verification code is: ${otp}`,
    //   });
    // } catch (err) {
    //   throw new AppError(
    //     'There was an error sending the email, Try again later!',
    //     500,
    //   );
    // }

    sendEmail({
      email: 'weehaghamel@gmail.com', //'amjadmhmoud3@gmail.com', // email
      subject: 'Your OTP Code (valid for 5 minutes)',
      message: `Your verification code is: ${otp}`,
    });

    const hashedPassword = await hashPassword(password);

    return this.authRepository.createUserWithClient({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires: expires,
    });
  }

  async login(data) {
    const { email, password } = data;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user || !(await correctPassword(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    if (!user.otpVerified) {
      throw new AppError('Please verify your email first', 401);
    }

    const token = signToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    const sanitizedUser = sanitizeUser(user);

    return { user: sanitizedUser, token, refreshToken };
  }

  async forgotPassword(data) {
    const { email } = data;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError('User is not found', 404);
    }

    const { otp, hashedOtp, expires } = generateOtp();

    // try {
    //   await sendEmail({
    //     email: 'weehaghamel@gmail.com', // user.email
    //     subject: 'Your password reset otp (valid for 10 min)',
    //     message: `Your password reset otp is: ${otp}`,
    //   });
    // } catch (err) {
    //   await this.authRepository.updatedUser(user.id, {
    //     passwordResetOtp: null,
    //     passwordResetExpires: null,
    //   });

    //   throw new AppError(
    //     'There was an error sending the email, Try again later!',
    //     500,
    //   );
    // }

    sendEmail({
      email: 'weehaghamel@gmail.com', //'amjadmhmoud3@gmail.com', // email
      subject: 'Your OTP Code (valid for 5 minutes)',
      message: `Your verification code is: ${otp}`,
    });

    return this.authRepository.updatedUser(user.id, {
      passwordResetOtp: hashedOtp,
      passwordResetExpires: expires,
    });
  }

  async verifyPasswordResetOtp(data) {
    const { otp, email } = data;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const hashedOtp = hashOtp(otp);

    if (
      user.passwordResetOtp !== hashedOtp ||
      user.passwordResetExpires < Date.now()
    ) {
      throw new AppError('OTP is invalid or has expired', 404);
    }

    const { resetToken, hashedToken, expires } = createPasswordResetToken();

    await this.authRepository.updatedUser(user.id, {
      passwordResetOtp: null,
      passwordResetExpires: null,
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: expires,
    });

    return resetToken;
  }

  async resetPassword(resetToken, data) {
    const { password } = data;

    const hashedToken = hashToken(resetToken);

    const user = await this.authRepository.findUserByResetToken(hashedToken);

    if (!user || user.passwordResetTokenExpires < new Date()) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await this.authRepository.updatedUser(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      passwordChangedAt: new Date(),
    });

    const token = signToken(updatedUser.id);
    const refreshToken = signRefreshToken(updatedUser.id);

    const sanitizedUser = sanitizeUser(updatedUser);

    return { updatedUser: sanitizedUser, token, refreshToken };
  }

  async updatePassword(userId, data) {
    const { passwordCurrent, password } = data;

    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new AppError('User is not found', 404);
    }

    if (!(await correctPassword(passwordCurrent, user.password))) {
      throw new AppError('Your current password is wrong', 401);
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await this.authRepository.updatedUser(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });

    const token = signToken(updatedUser.id);
    const refreshToken = signRefreshToken(updatedUser.id);

    const sanitizedUser = sanitizeUser(updatedUser);

    return { updatedUser: sanitizedUser, token, refreshToken };
  }

  async sendOtp(data) {
    const { email } = data;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError('User is not found', 404);
    }

    if (user.otpVerified) {
      throw new AppError('Email is already verified', 400);
    }

    const { otp, hashedOtp, expires } = generateOtp();

    // try {
    //   await sendEmail({
    //     email: 'weehaghamel@gmail.com', // user.email
    //     subject: 'Your OTP Code (valid for 5 minutes)',
    //     message: `Your verification code is: ${otp}`,
    //   });
    // } catch (err) {
    //   throw new AppError(
    //     'There was an error sending the email, Try again later!',
    //     500,
    //   );
    // }

    sendEmail({
      email: 'weehaghamel@gmail.com', //'amjadmhmoud3@gmail.com', // email
      subject: 'Your OTP Code (valid for 5 minutes)',
      message: `Your verification code is: ${otp}`,
    });

    return this.authRepository.updatedUser(user.id, {
      otp: hashedOtp,
      otpExpires: expires,
    });
  }

  async verifyOtp(data) {
    const { otp, email } = data;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) throw new AppError('User not found', 404);

    const hashedOtp = hashOtp(otp);

    if (user.otp !== hashedOtp || user.otpExpires < Date.now()) {
      throw new AppError('otp is invalid or has expired', 404);
    }

    const updatedUser = await this.authRepository.updatedUser(user.id, {
      otpVerified: true,
      otp: null,
      otpExpires: null,
    });

    const token = signToken(updatedUser.id);
    const refreshToken = signRefreshToken(updatedUser.id);

    const sanitizedUser = sanitizeUser(updatedUser);

    return { updatedUser: sanitizedUser, token, refreshToken };
  }

  async googleLogin(data) {
    const { idToken } = data;

    if (!idToken) {
      throw new AppError('Google token is required', 400);
    }

    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.emailVerified) {
      throw new AppError('Google email is not verified', 400);
    }

    const { email, name, googleId } = googleUser;

    const user = await this.authRepository.findUserByEmail(email);

    if (user) {
      if (!user.googleId) {
        await this.authRepository.updateUser(user.id, {
          googleId,
          signupMethod: 'GOOGLE',
          otpVerified: true,
        });
      }

      const token = signToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      return { user, token, refreshToken };
    }

    const newUser = await this.authRepository.createUser({
      data: {
        name,
        email,
        googleId,
        signupMethod: 'GOOGLE',
        otpVerified: true,
      },
    });

    const token = signToken(newUser.id);
    const refreshToken = signRefreshToken(newUser.id);

    const sanitizedUser = sanitizeUser(newUser);

    return { user: sanitizedUser, token, refreshToken };
  }

  async getMe(userId) {
    const user = await this.authRepository.findUserById(userId);

    const sanitizedUser = sanitizeProfileUser(user);

    return sanitizedUser;
  }
}

module.exports = AuthService;
