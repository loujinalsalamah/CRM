const AppError = require('../utils/appError');

module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    const userRole = req.user.role;

    if (userRole === 'CLIENT') {
      if (allowedRoles.includes('CLIENT')) {
        return next();
      }
      return next(new AppError('Not allowed', 403));
    }

    if (userRole === 'EMPLOYEE') {
      if (allowedRoles.includes('EMPLOYEE')) {
        return next();
      }

      const employeeRole = req.user.employee.role;
      if (allowedRoles.includes(employeeRole)) {
        return next();
      }
      return next(new AppError('Not allowed', 403));
    }

    return next(new AppError('Not allowed', 403));
  };
