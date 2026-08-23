class LeadRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createLead(data) {
    return this.prisma.$transaction(async (tx) => {
      const visitorSession = await tx.visitorSession.findUnique({
        where: { id: data.visitorSessionId },
        select: { id: true, islead: true },
      });

      if (!visitorSession) return null;
      if (visitorSession.islead) return visitorSession;

      await tx.visitorSession.update({
        where: { id: data.visitorSessionId },
        data: { islead: true },
      });

      await tx.lead.create({
        data: { visitorSessionId: data.visitorSessionId },
      });

      return tx.visitorSession.findUnique({
        where: { id: data.visitorSessionId },
        select: {
          id: true,
          createdAt: true,
          lastActiveAt: true,
          islead: true,
          ip: true,
        },
      });
    });
  }

  updateLead(visitorSessionId, data) {
    return this.prisma.lead.update({
      where: { visitorSessionId },
      data,
    });
  }
}

module.exports = LeadRepository;
