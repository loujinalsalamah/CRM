/* eslint-disable node/no-unsupported-features/es-syntax */
class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
    this.getDashboard = this.getDashboard.bind(this);
  }

  async getDashboard(req, res) {
    const queryString = req.query;
    const dashboard = await this.dashboardService.getDashboard(queryString);

    res.status(200).json({
      status: 'success',
      data: dashboard,
    });
  }
}

module.exports = DashboardController;
