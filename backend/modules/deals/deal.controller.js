class DealController {
  constructor(dealService) {
    this.dealService = dealService;
    this.createSaleLeaseDeal = this.createSaleLeaseDeal.bind(this);
    this.createBuyRentDeal = this.createBuyRentDeal.bind(this);
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
}

module.exports = DealController;
