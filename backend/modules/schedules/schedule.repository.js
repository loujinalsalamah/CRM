/* eslint-disable no-else-return */
/* eslint-disable node/no-unsupported-features/es-syntax */
class ScheduleRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createScheduleWithNotification(data) {
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

      if (schedule.type === 'PERSONAL') {
        return schedule;
      } else if (schedule.type === 'REQUEST') {
        await tx.notification.create({
          data: {
            title: 'Schedule Request',
            body: `Schedule for request in ${schedule.date}`,
            userId: schedule.request.client.userId,
            entityType: 'SCHEDULE',
            entityId: schedule.id,
          },
        });

        await tx.request.update({
          where: { id: schedule.requestId },
          data: { status: 'IN_PROGRESS' },
        });
      } else if (schedule.type === 'DEAL') {
        await tx.notification.create({
          data: {
            title: 'Schedule Deal',
            body: `Schedule for deal in ${schedule.date}`,
            userId: schedule.deal.client.userId,
            entityType: 'SCHEDULE',
            entityId: schedule.id,
          },
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
