const APIFeatures = require('../../utils/apiFeatures');
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
          saleLeaseDealId: true,
          buyRentDealId: true,
          request: { select: { client: { select: { userId: true } } } },
          saleLeaseDeal: { select: { client: { select: { userId: true } } } },
          buyRentDeal: { select: { client: { select: { userId: true } } } },
        },
      });

      if (schedule.type === 'REQUEST') {
        await tx.request.update({
          where: { id: schedule.requestId },
          data: { status: 'IN_PROGRESS' },
        });
      } else if (
        schedule.type === 'BUY_RENT_DEAL' &&
        schedule.title === 'MEETING'
      ) {
        await tx.buyRentDeal.update({
          where: { id: schedule.buyRentDealId },
          data: { dealStatus: 'NEGOTIATING' },
        });
      }
      return schedule;
    });
  }

  findAllDealSchedules(dealId, queryString) {
    let features = new APIFeatures(queryString);

    features = features.sort();

    features.options.where = {
      OR: [{ buyRentDealId: dealId }, { saleLeaseDealId: dealId }],
    };

    features.options.select = {
      id: true,
      type: true,
      date: true,
      title: true,
      description: true,
      rejectOn: true,
      acceptOn: true,
      buyRentDealId: true,
      saleLeaseDealId: true,
    };

    return this.prisma.schedule.findMany(features.options);
  }

  findAllRequestSchedules(requestId) {
    return this.prisma.schedule.findMany({
      where: { requestId },
      select: {
        id: true,
        type: true,
        date: true,
        title: true,
        description: true,
        rejectOn: true,
        acceptOn: true,
        request: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  findAllEmplyeeSchedules(employeeId, queryString) {
    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();

    features.options.where.employeeId = employeeId;

    features.options.select = {
      id: true,
      type: true,
      date: true,
      title: true,
      description: true,
      rejectOn: true,
      acceptOn: true,
      request: {
        select: {
          id: true,
        },
      },
      buyRentDeal: {
        select: {
          id: true,
        },
      },
      saleLeaseDeal: {
        select: {
          id: true,
        },
      },
    };

    return this.prisma.schedule.findMany(features.options);
  }

  findScheduleById(id) {
    return this.prisma.schedule.findUnique({
      where: { id },
      select: {
        id: true,
        employeeId: true,
        date: true,
        type: true,
        title: true,
        employee: {
          select: {
            userId: true,
          },
        },
        request: {
          select: {
            client: {
              select: {
                userId: true,
              },
            },
          },
        },
        buyRentDeal: {
          select: {
            client: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });
  }

  updateSchedule(id, data) {
    return this.prisma.schedule.update({ where: { id }, data });
  }

  deleteSchedule(id) {
    return this.prisma.schedule.delete({ where: { id } });
  }

  findSchedulesForReminder(startTime, endTime) {
    return this.prisma.schedule.findMany({
      where: {
        date: {
          gte: startTime,
          lt: endTime,
        },
        OR: [{ type: 'REQUEST' }, { type: 'BUY_RENT_DEAL', title: 'MEETING' }],
        acceptOn: {
          not: null,
        },
        rejectOn: null,
      },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        employee: {
          select: {
            userId: true,
          },
        },
      },
    });
  }
}

module.exports = ScheduleRepository;
