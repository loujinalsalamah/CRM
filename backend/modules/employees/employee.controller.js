const AppError = require('../../utils/appError');

class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;

    this.createEmployee = this.createEmployee.bind(this);
  }

  async createEmployee(req, res, next) {
    const data = req.body;

    const employee = await this.employeeService.createEmployee(data);

    if (!employee) {
      return next(new AppError('Failed to create employee'));
    }

    res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
    });
  }
}

module.exports = EmployeeController;
