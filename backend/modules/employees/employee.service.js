/* eslint-disable no-restricted-syntax */
const hashPassword = require('../../utils/hashPassword');

class EmployeeService {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async createEmployee(data) {
    const hashedPassword = await hashPassword(data.password);

    return this.employeeRepository.createEmployeeWithAccount({
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...data,
      password: hashedPassword,
    });
  }

  async getAllEmployees(queryString) {
    const employees =
      await this.employeeRepository.findAllEmployees(queryString);

    for (const employee of employees) {
      employee.totalDeals = 20;
    }
    return employees;
  }

  async getEmployee(id) {
    const employee = await this.employeeRepository.findEmployeeById(id);

    employee.totalDeals = 20;

    return employee;
  }
}

module.exports = EmployeeService;
