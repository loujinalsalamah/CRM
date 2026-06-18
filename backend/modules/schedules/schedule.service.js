/* eslint-disable no-else-return */
/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../../utils/appError');
const sanitizePersonalSchedule = require('../../utils/sanitizePersonalSchedule');
const sanitizeRequestSchedule = require('../../utils/sanitizeRequestSchedule');
const sanitizeDealSchedule = require('../../utils/sanitizeDealSchedule');

class ScheduleService {
  constructor(scheduleRepository) {
    this.scheduleRepository = scheduleRepository;
  }

  async createSchedule(employeeId, data) {
    return this.scheduleRepository.createScheduleWithNotification({
      ...data,
      employeeId,
      date: new Date(data.date),
      acceptOn: null,
    });
  }

  async getSchedule(id) {
    const schedule = await this.scheduleRepository.findScheduleById(id);
    if (schedule.type === 'PERSONAL') {
      return sanitizePersonalSchedule(schedule);
    } else if (schedule.type === 'REQUEST') {
      return sanitizeRequestSchedule(schedule);
    } else if (schedule.type === 'DEAL') {
      return sanitizeDealSchedule(schedule);
    }
    return schedule;
  }

  async updateSchedule(id, data) {
    let schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      return null;
    }

    schedule = await this.scheduleRepository.updateSchedule(id, data);

    if (schedule.type === 'PERSONAL') {
      return sanitizePersonalSchedule(schedule);
    } else if (schedule.type === 'REQUEST') {
      return sanitizeRequestSchedule(schedule);
    } else if (schedule.type === 'DEAL') {
      return sanitizeDealSchedule(schedule);
    }
    return schedule;
  }

  async deleteSchedule(id) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      return null;
    }

    if (schedule.type !== 'PERSONAL') {
      throw new AppError('Only personal schedules can be deleted', 400);
    }

    return this.scheduleRepository.deleteSchedule(id);
  }

  async acceptSchedule(id) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      return null;
    }

    if (schedule.type !== 'REQUEST') {
      throw new AppError('Only request schedules can be accepted', 400);
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

    return sanitizeRequestSchedule(updatedSchedule);
  }

  async rejectSchedule(id) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      return null;
    }

    if (schedule.type !== 'REQUEST') {
      throw new AppError('Only request schedules can be rejected', 400);
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

    return sanitizeRequestSchedule(updatedSchedule);
  }

  async cancelSchedule(id, data) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      return null;
    }

    if (schedule.canceledAt) {
      throw new AppError('Schedule already canceled', 400);
    }

    if (schedule.completedAt) {
      throw new AppError('Cannot cancel a completed schedule', 400);
    }

    const canceledSchedule = await this.scheduleRepository.updateSchedule(id, {
      ...data,
      canceledAt: new Date(),
    });

    return sanitizeRequestSchedule(canceledSchedule);
  }

  async completeSchedule(id, data) {
    const schedule = await this.scheduleRepository.findScheduleById(id);

    if (!schedule) {
      return null;
    }

    if (schedule.completedAt) {
      throw new AppError('Schedule already completed', 400);
    }

    if (schedule.canceledAt) {
      throw new AppError('Cannot complete a canceled schedule', 400);
    }

    const completedSchedule = await this.scheduleRepository.updateSchedule(id, {
      ...data,
      completedAt: new Date(),
    });

    return sanitizeRequestSchedule(completedSchedule);
  }
}

module.exports = ScheduleService;
