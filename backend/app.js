const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRoutes = require('./modules/auth/auth.routes');
const scheduleRoutes = require('./modules/schedules/schedule.routes');
const employeeRoutes = require('./modules/employees/employee.routes');

const globalErrorHandler = require('./middlewares/globalErrorHandler');
const AppError = require('./utils/appError');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cookieParser());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/employees', employeeRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
