/* eslint-disable no-shadow */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
module.exports = function sanitizeUser(user) {
  if (!user) return null;

  const {
    password,
    passwordChangedAt,
    passwordResetOtp,
    passwordResetExpires,
    otp,
    otpExpires,
    passwordResetToken,
    passwordResetTokenExpires,
    googleId,
    createdAt,
    updatedAt,
    signupMethod,
    ...cleanUser
  } = user;

  if (cleanUser.client) {
    const {
      location,
      longitude,
      latitude,
      phone,
      preferredLocation,
      minimalPreferredPrice,
      maximumPreferredPrice,
      preferredNumberOfRooms,
      visitorSessionId,
      createdAt,
      updatedAt,
      userId,
      ...cleanClient
    } = cleanUser.client;

    cleanUser.client = cleanClient;
    delete cleanUser.employee;
  } else if (cleanUser.employee) {
    const {
      salary,
      createdAt,
      location,
      phone,
      productivity,
      averageResponseTime,
      userId,
      updatedAt,
      ...cleanEmployee
    } = cleanUser.employee;

    cleanUser.employee = cleanEmployee;
    delete cleanUser.client;
  }

  return cleanUser;
};
