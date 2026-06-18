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
}

module.exports = EmployeeService;
