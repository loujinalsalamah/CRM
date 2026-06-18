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
          name: data.name,
          role: 'EMPLOYEE',
          otpVerified: true,
        },
      });

      const employee = await tx.employee.create({
        data: {
          name: data.name,
          role: data.type,
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
