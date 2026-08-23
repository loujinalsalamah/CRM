class DealController {
  constructor(dealService) {
    this.dealService = dealService;
    this.createSaleLeaseDeal = this.createSaleLeaseDeal.bind(this);
    this.createBuyRentDeal = this.createBuyRentDeal.bind(this);
    this.getDealById = this.getDealById.bind(this);
    this.changeProperty = this.changeProperty.bind(this);
    this.changeEmployee = this.changeEmployee.bind(this);
  }

  async createSaleLeaseDeal(req, res, next) {
    const data = req.body;

    await this.dealService.createSaleLeaseDeal(data);

    res.status(201).json({
      status: 'success',
      message: 'deal created successfully',
    });
  }

  async createBuyRentDeal(req, res, next) {
    const data = req.body;

    await this.dealService.createBuyRentDeal(data);

    res.status(201).json({
      status: 'success',
      message: 'deal created successfully',
    });
  }

  async getDealById(req, res, next) {
    const { id } = req.params;
    const { user } = req;

    const deal = await this.dealService.getDealById(id, user);

    res.status(200).json({
      status: 'success',
      data: deal,
    });
  }

  async changeProperty(req, res, next) {
    const { id } = req.params;
    const data = req.body;
    const { user } = req;

    await this.dealService.changeProperty(id, data, user);

    res.status(200).json({
      status: 'success',
      message: 'Property updated for this deal successfully',
    });
  }

  async changeEmployee(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    await this.dealService.changeEmployee(id, data);

    res.status(200).json({
      status: 'success',
      message: 'Employee updated for this deal successfully',
    });
  }
}

module.exports = DealController;
