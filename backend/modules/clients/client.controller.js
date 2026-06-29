const AppError = require('../../utils/appError');

class ClientController {
  constructor(clientService) {
    this.clientService = clientService;

    this.updateMe = this.updateMe.bind(this);
    this.addToFavorite = this.addToFavorite.bind(this);
    this.removeFromFavorite = this.removeFromFavorite.bind(this);
    this.getMyFavorite = this.getMyFavorite.bind(this);
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

  async getMyFavorite(req, res, next) {
    const clientId = req.user.client.id;
    const queryString = req.query;

    const favorites = await this.clientService.getMyFavorite(
      clientId,
      queryString,
    );

    res.status(200).json({
      status: 'success',
      data: favorites,
    });
  }

  async addToFavorite(req, res, next) {
    const clientId = req.user.client.id;
    const data = req.body;

    await this.clientService.addToFavorite(clientId, data);

    res.status(200).json({
      status: 'success',
      message: 'Property added successfully',
    });
  }

  async removeFromFavorite(req, res, next) {
    const clientId = req.user.client.id;
    const data = req.body;

    await this.clientService.removeFromFavorite(clientId, data);

    res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully',
    });
  }
}

module.exports = ClientController;
