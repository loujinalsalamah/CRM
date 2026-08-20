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
      // else if (schedule.type === 'DEAL' && schedule.title === 'MEETING') {
      //   await tx.deal.update({
      //     where: { id: schedule.dealId },
      //     data: { status: '' },
      //   });
      // }
      return schedule;
    });
  }

  // findAllDealSchedules(dealId, queryString) {
  //   let features = new APIFeatures(queryString);

  //   features = features.sort();

  //   features.options.where.dealId = dealId;

  //   features.options.select = {
  //     id: true,
  //     type: true,
  //     date: true,
  //     title: true,
  //     description: true,
  //     rejectOn: true,
  //     acceptOn: true,
  //     // deal: {
  //     //   select: {
  //     //     id: true,
  //     //     title: true,
  //     //   },
  //     // },
  //   };

  //   return this.prisma.schedule.findMany(features.options);
  // }

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
      // deal: {
      //   select: {
      //     id: true,
      //     title: true,
      //   },
      // },
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
        // deal: {
        //   select: {
        //     client: {
        //       select: {
        //         userId: true,
        //       },
        //     },
        //   },
        // },
      },
    });
  }

  updateSchedule(id, data) {
    return this.prisma.schedule.update({ where: { id }, data });
  }

  deleteSchedule(id) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}

module.exports = ScheduleRepository;
