class VisitorController {
  constructor(visitorService) {
    this.visitorService = visitorService;
    this.createVisitorSession = this.createVisitorSession.bind(this);
  }

  async createVisitorSession(req, res) {
    const data = req.body;

    const visitorSession = await this.visitorService.createVisitorSession(data);

    res.status(201).json({
      status: 'success',
      data: visitorSession,
    });
  }
}

module.exports = VisitorController;
