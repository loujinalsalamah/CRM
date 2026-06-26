const APIFeatures = require('../../utils/apiFeatures');

class EmployeeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createEmployeeWithAccount(data) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: data.password,
          role: 'EMPLOYEE',
          otpVerified: true,
        },
      });

      const employee = await tx.employee.create({
        data: {
          name: data.name,
          role: data.role,
          fullName: data.fullName,
          location: data.location,
          phone: data.phone,
          photo: data.photo,
          salary: data.salary,
          userId: user.id,
        },
      });

      return employee;
    });
  }

  findAllEmployees(queryString) {
    queryString.select = 'id,name,fullName,photo,role,location,productivity';

    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.limitFields();

    return this.prisma.employee.findMany(features.options);
  }

  findEmployeeById(id) {
    const select = {
      id: true,
      name: true,
      fullName: true,
      photo: true,
      phone: true,
      role: true,
      location: true,
      productivity: true,
      averageResponseTime: true,
      salary: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    };
    return this.prisma.employee.findUnique({ where: { id }, select });
  }

  findBestConsultant() {
    return this.prisma.employee.findFirst({
      where: {
        role: 'CONSULTANT',
      },
      orderBy: {
        requests: {
          _count: 'asc',
        },
      },
    });
  }
}

module.exports = EmployeeRepository;
