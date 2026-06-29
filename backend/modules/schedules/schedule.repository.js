/* eslint-disable no-else-return */
/* eslint-disable node/no-unsupported-features/es-syntax */
class ScheduleRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createSchedule(data) {
    return this.prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({
        data,
        select: {
          id: true,
          type: true,
          date: true,
          title: true,
          description: true,
          requestId: true,
          // dealId: true,
          request: { select: { client: { select: { userId: true } } } },
          // deal: { select: { client: { select: { userId: true } } } },
        },
      });

      if (schedule.type === 'REQUEST') {
        await tx.request.update({
          where: { id: schedule.requestId },
          data: { status: 'IN_PROGRESS' },
        });
      }
      return schedule;
    });
  }

  findScheduleById(id) {
    return this.prisma.schedule.findUnique({ where: { id } });
  }

  updateSchedule(id, data) {
    return this.prisma.schedule.update({ where: { id }, data });
  }

  deleteSchedule(id) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}

module.exports = ScheduleRepository;
