const AppError = require('../../utils/appError');

class ClientController {
  constructor(clientService) {
    this.clientService = clientService;

    this.updateMe = this.updateMe.bind(this);
  }

  async updateMe(req, res, next) {
    const clientId = req.user.client.id;
    const data = req.body;

    const client = await this.clientService.updateMe(clientId, data);

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Client updated successfully',
    });
  }
}

module.exports = ClientController;
