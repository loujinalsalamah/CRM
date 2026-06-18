const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const AppError = require('../utils/appError');
const sanitizeUser = require('../utils/sanitizeUser');

const changedPasswordAfter = (JWTTimestamp, passwordChangedAt) => {
  if (!passwordChangedAt) return false;

  const changedTimestamp = parseInt(passwordChangedAt.getTime() / 1000, 10);

  return JWTTimestamp < changedTimestamp;
};

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: { client: true, employee: true },
  });

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }

  if (changedPasswordAfter(decoded.iat, currentUser.passwordChangedAt)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }
  req.user = sanitizeUser(currentUser);
  next();
};

module.exports = protect;
