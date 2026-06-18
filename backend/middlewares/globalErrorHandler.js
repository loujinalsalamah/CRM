const { ZodError } = require('zod');
const AppError = require('../utils/appError');

// 23505 → duplicate key
const handleDuplicateKey = (err) => {
  const { detail } = err;
  const value = detail.match(/\((.*?)\)=\((.*?)\)/);

  const field = value[1];
  const val = value[2];

  const message = `Duplicate value for field '${field}': '${val}'. Please use another value.`;
  return new AppError(message, 400);
};

// 23514 → check constraint violation (ENUM)
const handleCheckViolation = (err) => {
  const message = `Invalid value for field '${err.column || 'unknown'}'.`;
  return new AppError(message, 400);
};

// 22P02 → invalid input syntax
const handleInvalidInput = () => new AppError('Invalid input syntax.', 400);

// 23502 → not null violation
const handleNotNull = (err) => {
  const { column } = err;
  return new AppError(`Field '${column}' cannot be null.`, 400);
};

// 23503 → foreign key violation
const handleForeignKey = () =>
  new AppError('Invalid reference. Foreign key constraint failed.', 400);

// P2002 → prisma duplicate
const handlePrismaDuplicate = (err) => {
  const { target } = err.meta;
  const message = `Duplicate value for field: ${target}`;
  return new AppError(message, 400);
};

// P2003 → prisma Foreign Key
const handlePrismaForeignKey = () =>
  new AppError('Invalid reference. Foreign key constraint failed.', 400);

// P2025 → prisma not found
const handlePrismaNotFound = () => new AppError('Record not found.', 404);

// invalid token
const handleJWTError = () =>
  new AppError('Invalid token! Please log on again!', 401);

// expired token
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

// Zod validation error
const handleZodError = (err) => {
  const errors = err.issues.map((e) => `${e.path.join('.')} - ${e.message}`);
  const message = `Invalid input data. ${errors.join('; ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;

    // Zod validation errors
    if (error instanceof ZodError) {
      error = handleZodError(error);
      return sendErrorProd(error, res);
    }

    // PostgreSQL errors
    if (error.code === '23505') error = handleDuplicateKey(error);
    if (error.code === '22P02') error = handleInvalidInput(error);
    if (error.code === '23502') error = handleNotNull(error);
    if (error.code === '23503') error = handleForeignKey(error);
    if (error.code === '23514') error = handleCheckViolation(error);

    // Prisma errors
    if (error.code === 'P2002') error = handlePrismaDuplicate(error);
    if (error.code === 'P2003') error = handlePrismaForeignKey(error);
    if (error.code === 'P2025') error = handlePrismaNotFound(error);

    // JWT errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    return sendErrorProd(error, res);
  }
};
