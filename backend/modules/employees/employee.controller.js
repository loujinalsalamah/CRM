const AppError = require('../../utils/appError');

class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;

    this.createEmployee = this.createEmployee.bind(this);
    this.getAllEmployees = this.getAllEmployees.bind(this);
    this.getEmployee = this.getEmployee.bind(this);
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

  async getAllEmployees(req, res, next) {
    const queryString = req.query;

    const employees = await this.employeeService.getAllEmployees(queryString);

    res.status(200).json({
      status: 'success',
      results: employees.length,
      data: employees,
    });
  }

  async getEmployee(req, res, next) {
    const { id } = req.params;

    const employee = await this.employeeService.getEmployee(id);

    res.status(200).json({
      status: 'success',
      data: employee,
    });
  }
}

module.exports = EmployeeController;
