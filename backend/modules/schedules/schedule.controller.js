const AppError = require('../../utils/appError');

class ScheduleController {
  constructor(scheduleService) {
    this.scheduleService = scheduleService;

    this.createSchedule = this.createSchedule.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
    this.updateSchedule = this.updateSchedule.bind(this);
    this.deleteSchedule = this.deleteSchedule.bind(this);
    this.acceptSchedule = this.acceptSchedule.bind(this);
    this.rejectSchedule = this.rejectSchedule.bind(this);
    this.cancelSchedule = this.cancelSchedule.bind(this);
    this.completeSchedule = this.completeSchedule.bind(this);
  }

  async createSchedule(req, res, next) {
    const employeeId = req.user.employee.id;
    const data = req.body;

    const schedule = await this.scheduleService.createSchedule(
      employeeId,
      data,
    );

    if (!schedule) {
      return next(new AppError('Failed to create schedule', 400));
    }

    res.status(201).json({
      status: 'success',
      data: schedule,
    });
  }

  async getSchedule(req, res, next) {
    const { id } = req.params;

    const schedule = await this.scheduleService.getSchedule(id);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: schedule,
    });
  }

  async updateSchedule(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    const schedule = await this.scheduleService.updateSchedule(id, data);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: schedule,
    });
  }

  async deleteSchedule(req, res, next) {
    const { id } = req.params;

    const schedule = await this.scheduleService.deleteSchedule(id);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(204).json({
      status: 'success',
    });
  }

  async acceptSchedule(req, res, next) {
    const { id } = req.params;

    const schedule = await this.scheduleService.acceptSchedule(id);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Schedule accepted successfully',
    });
  }

  async rejectSchedule(req, res, next) {
    const { id } = req.params;

    const schedule = await this.scheduleService.rejectSchedule(id);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Schedule rejected successfully',
    });
  }

  async cancelSchedule(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    const schedule = await this.scheduleService.cancelSchedule(id, data);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Schedule canceled successfully',
    });
  }

  async completeSchedule(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    const schedule = await this.scheduleService.completeSchedule(id, data);

    if (!schedule) {
      return next(new AppError('Schedule not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Schedule completed successfully',
    });
  }
}

module.exports = ScheduleController;
