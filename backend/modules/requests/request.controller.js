class RequestController {
  constructor(requestService) {
    this.requestService = requestService;
    this.createRequest = this.createRequest.bind(this);
    this.getMyRequests = this.getMyRequests.bind(this);
    this.getRequestById = this.getRequestById.bind(this);
  }

  async createRequest(req, res, next) {
    const clientId = req.user.client.id;
    const data = req.body;

    const request = await this.requestService.createRequest(clientId, data);

    res.status(201).json({
      status: 'success',
      data: request,
    });
  }

  async getMyRequests(req, res, next) {
    const employeeId = req.user.employee.id;
    const queryString = req.query;

    const requests = await this.requestService.getMyRequests(
      employeeId,
      queryString,
    );

    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: requests,
    });
  }

  async getRequestById(req, res, next) {
    const { id } = req.params;

    const request = await this.requestService.getRequestById(id);

    res.status(200).json({
      status: 'success',
      data: request,
    });
  }
}
module.exports = RequestController;
