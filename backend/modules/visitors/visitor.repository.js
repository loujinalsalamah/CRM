class VisitorRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createVisitorSession(data) {
    return this.prisma.visitorSession.create({
      data,
      select: {
        id: true,
        createdAt: true,
        lastActiveAt: true,
        islead: true,
        ip: true,
      },
    });
  }
}

module.exports = VisitorRepository;
