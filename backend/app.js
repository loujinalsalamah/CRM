const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const requestRoutes = require('./modules/requests/request.routes');
const propertyRoutes = require('./modules/properties/property.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(cookieParser());

app.use('/api/v1/requests', requestRoutes);

app.use('/api/v1/properties', propertyRoutes);

app.use('/api/v1/notifications', notificationRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
