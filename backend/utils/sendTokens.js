const sendTokens = (res, statusCode, user, token, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

module.exports = sendTokens;
