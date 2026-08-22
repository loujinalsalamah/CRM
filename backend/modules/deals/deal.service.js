class DealService {
  constructor(dealRepository, notificationService) {
    this.dealRepository = dealRepository;
    this.notificationService = notificationService;
  }

  async createSaleLeaseDeal(data) {
    let deal = await this.dealRepository.findSaleLeaseDealByPropertyId(
      data.propertyId,
    );

    if (deal) {
      throw new Error('A deal already exists for this property');
    }

    deal = await this.dealRepository.createSaleLeaseDeal(data);

    if (!deal) {
      throw new Error('Failed to create deal');
    }

    await this.notificationService.createNotification({
      title: 'New Deal Created',
      body: `A new deal has been created with ID: ${deal.id}`,
      userId: deal.employee.userId,
      entityType: 'DEAL',
      entityId: deal.id,
    });
  }

  async createBuyRentDeal(data) {
    let deal = await this.dealRepository.findActiveBuyRentDealByPropertyId(
      data.propertyId,
    );

    if (deal) {
      throw new Error('A deal already exists for this property');
    }

    deal = await this.dealRepository.createBuyRentDeal(data);

    if (!deal) {
      throw new Error('Failed to create deal');
    }

    await this.notificationService.createNotification({
      title: 'New Deal Created',
      body: `A new deal has been created with ID: ${deal.id}`,
      userId: deal.employee.userId,
      entityType: 'DEAL',
      entityId: deal.id,
    });
  }
}

module.exports = DealService;
