const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const requestRoutes = require('./modules/requests/request.routes');
const propertyRoutes = require('./modules/properties/property.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const userRoutes = require('./modules/auth/auth.routes');
const scheduleRoutes = require('./modules/schedules/schedule.routes');
const employeeRoutes = require('./modules/employees/employee.routes');
const clientRoutes = require('./modules/clients/client.routes');

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cookieParser());

app.use('/api/v1/requests', requestRoutes);

app.use('/api/v1/properties', propertyRoutes);

app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/clients', clientRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
