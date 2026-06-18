/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
module.exports = function sanitizeProfileUser(user) {
  if (!user) return null;

  const {
    isActive,
    password,
    passwordResetOtp,
    passwordResetExpires,
    passwordChangedAt,
    otp,
    otpExpires,
    otpVerified,
    signupMethod,
    passwordResetToken,
    passwordResetTokenExpires,
    googleId,
    ...cleanUser
  } = user;

  if (cleanUser.client) {
    const { visitorSessionId, userId, ...cleanClient } = cleanUser.client;

    cleanUser.client = cleanClient;
    delete cleanUser.employee;
  }

  if (cleanUser.employee) {
    const { name, userId, ...cleanEmployee } = cleanUser.employee;

    cleanUser.employee = cleanEmployee;
    delete cleanUser.client;
  }

  return cleanUser;
};
