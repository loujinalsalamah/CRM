class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUserWithClient(data) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: data.password,
          otp: data.otp,
          otpExpires: data.otpExpires,
          role: 'CLIENT',
        },
      });

      await tx.client.create({
        data: {
          userId: user.id,
          name: data.name,
        },
      });
    });
  }

  updatedUser(id, data) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  findUserById(id) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        employee: true,
        client: true,
      },
    });
  }

  findUserByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        employee: true,
        client: true,
      },
    });
  }

  findUserByResetToken(hashedToken) {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
      },
    });
  }
}
module.exports = AuthRepository;
