/* eslint-disable no-else-return */
/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../../utils/appError');

class ScheduleService {
  constructor(scheduleRepository, notificationService) {
    this.scheduleRepository = scheduleRepository;
    this.notificationService = notificationService;
  }

  async createSchedule(employeeId, data) {
    const schedule = await this.scheduleRepository.createSchedule({
      ...data,
      employeeId,
      date: new Date(data.date),
      acceptOn: null,
      rejectOn: null,
    });

    if (schedule.type === 'REQUEST') {
      await this.notificationService.createNotification({
        title: 'Schedule Request',
        body: `Schedule for request in ${schedule.date}`,
        userId: schedule.request.client.userId,
        entityType: 'SCHEDULE',
        entityId: schedule.id,
      });
    } else if (schedule.type === 'DEAL' && schedule.title === 'MEETING') {
      await this.notificationService.createNotification({
        title: 'Schedule Deal',
        body: `Schedule for deal in ${schedule.date}`,
        userId: schedule.deal.client.userId,
        entityType: 'SCHEDULE',
        entityId: schedule.id,
      });
    }
  }

  async getMySchedules(employeeId, queryString) {
    return await this.scheduleRepository.findAllEmplyeeSchedules(
      employeeId,
      queryString,
    );
  }

  // async getDealSchedules(dealId, queryString) {
  //   return await this.scheduleRepository.findAllDealSchedules(
  //     dealId,
  //     queryString,
  //   );
  // }

  async getRequestSchedules(requestId) {
    return await this.scheduleRepository.findAllRequestSchedules(requestId);
  }

  async deleteSchedule(id, employeeId) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    if (employeeId !== schedule.employeeId) {
      throw new AppError('You are not authorized to delete this schedule', 403);
    }

    if (schedule.type !== 'PERSONAL') {
      throw new AppError('Only personal schedules can be deleted', 400);
    }

    return this.scheduleRepository.deleteSchedule(id);
  }

  async acceptSchedule(id) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    if (schedule.type !== 'REQUEST' && schedule.type !== 'DEAL') {
      throw new AppError(
        'Only request and deal schedules can be accepted',
        400,
      );
    }

    if (schedule.acceptOn) {
      throw new AppError('Schedule already accepted', 400);
    }

    if (schedule.rejectOn) {
      throw new AppError('Schedule already rejected', 400);
    }

    const updatedSchedule = await this.scheduleRepository.updateSchedule(id, {
      acceptOn: new Date(),
    });

    if (updatedSchedule.type === 'REQUEST') {
      await this.notificationService.createNotification({
        title: 'Schedule Request',
        body: `Schedule for request in ${schedule.date} is accepted`,
        userId: schedule.employee.userId,
        entityType: 'SCHEDULE',
        entityId: schedule.id,
      });
    } else if (
      updatedSchedule.type === 'DEAL' &&
      updatedSchedule.title === 'MEETING'
    ) {
      await this.notificationService.createNotification({
        title: 'Schedule Deal',
        body: `Schedule for deal in ${schedule.date} is accepted`,
        userId: schedule.employee.userId,
        entityType: 'SCHEDULE',
        entityId: schedule.id,
      });
    }
  }

  async rejectSchedule(id) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    if (schedule.type !== 'REQUEST' && schedule.type !== 'DEAL') {
      throw new AppError(
        'Only request and deal schedules can be rejected',
        400,
      );
    }

    if (schedule.rejectOn) {
      throw new AppError('Schedule already rejected', 400);
    }

    if (schedule.acceptOn) {
      throw new AppError('Schedule already accepted', 400);
    }

    const updatedSchedule = await this.scheduleRepository.updateSchedule(id, {
      rejectOn: new Date(),
    });

    if (updatedSchedule.type === 'REQUEST') {
      await this.notificationService.createNotification({
        title: 'Schedule Request',
        body: `Schedule for request in ${schedule.date} is rejected`,
        userId: schedule.employee.userId,
        entityType: 'SCHEDULE',
        entityId: schedule.id,
      });
    } else if (
      updatedSchedule.type === 'DEAL' &&
      updatedSchedule.title === 'MEETING'
    ) {
      await this.notificationService.createNotification({
        title: 'Schedule Deal',
        body: `Schedule for deal in ${schedule.date} is rejected`,
        userId: schedule.employee.userId,
        entityType: 'SCHEDULE',
        entityId: schedule.id,
      });
    }
  }
}

module.exports = ScheduleService;
