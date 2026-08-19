class ScheduleController {
  constructor(scheduleService) {
    this.scheduleService = scheduleService;

    this.createSchedule = this.createSchedule.bind(this);
    this.getMySchedules = this.getMySchedules.bind(this);
    this.deleteSchedule = this.deleteSchedule.bind(this);
    this.acceptSchedule = this.acceptSchedule.bind(this);
    this.rejectSchedule = this.rejectSchedule.bind(this);
  }

  async createSchedule(req, res, next) {
    const employeeId = req.user.employee.id;
    const data = req.body;

    await this.scheduleService.createSchedule(employeeId, data);

    res.status(201).json({
      status: 'success',
      message: 'Schedule created successfully',
    });
  }

  async getMySchedules(req, res, next) {
    const employeeId = req.user.employee.id;
    const queryString = req.query;

    const schedules = await this.scheduleService.getMySchedules(
      employeeId,
      queryString,
    );

    res.status(200).json({
      status: 'success',
      length: schedules.length,
      data: schedules,
    });
  }

  // async getDealSchedules(req, res, next) {
  //   const dealId = req.params.dealId;
  //   const queryString = req.query;

  //   const schedules = await this.scheduleService.getDealSchedules(
  //     dealId,
  //     queryString,
  //   );

  //   res.status(200).json({
  //     status: 'success',
  //     results: schedules.length,
  //     data: schedules,
  //   });
  // }

  async getRequestSchedules(req, res, next) {
    const { requestId } = req.params;

    const schedules = await this.scheduleService.getRequestSchedules(requestId);

    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: schedules,
    });
  }

  async deleteSchedule(req, res, next) {
    const { id } = req.params;
    const employeeId = req.user.employee.id;

    await this.scheduleService.deleteSchedule(id, employeeId);

    res.status(204).json({
      status: 'success',
      message: 'Schedule deleted successfully',
    });
  }

  async acceptSchedule(req, res, next) {
    const { id } = req.params;

    await this.scheduleService.acceptSchedule(id);

    res.status(200).json({
      status: 'success',
      message: 'Schedule accepted successfully',
    });
  }

  async rejectSchedule(req, res, next) {
    const { id } = req.params;

    await this.scheduleService.rejectSchedule(id);

    res.status(200).json({
      status: 'success',
      message: 'Schedule rejected successfully',
    });
  }
}

module.exports = ScheduleController;
