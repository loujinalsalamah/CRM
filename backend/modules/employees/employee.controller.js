class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;

    this.createEmployee = this.createEmployee.bind(this);
  }

  async createEmployee(req, res, next) {
    const data = req.body;

    const employee = await this.employeeService.createEmployee(data);

    res.status(201).json({
      status: ' success ',
      data: employee,
    });
  }
}

module.exports = EmployeeController;
