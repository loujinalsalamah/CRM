const AppError = require('../../utils/appError');

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
      throw new AppError('A deal already exists for this property', 400);
    }

    deal = await this.dealRepository.createSaleLeaseDeal(data);

    if (!deal) {
      throw new AppError('Failed to create deal', 400);
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
      throw new AppError('A deal already exists for this property', 400);
    }

    deal = await this.dealRepository.createBuyRentDeal(data);

    if (!deal) {
      throw new AppError('Failed to create deal', 400);
    }

    await this.notificationService.createNotification({
      title: 'New Deal Created',
      body: `A new deal has been created with ID: ${deal.id}`,
      userId: deal.employee.userId,
      entityType: 'DEAL',
      entityId: deal.id,
    });
  }

  async getDealById(id, user) {
    const deal = await this.dealRepository.findDealByIdFromBothTables(id);

    if (!deal) {
      throw new AppError('Deal not found with the provided ID', 404);
    }

    if (
      user.employee.role !== 'SALES_MANAGER' &&
      user.employee.role !== 'GENERAL_MANAGER' &&
      user.employee.id !== deal.employeeId
    ) {
      throw new AppError(
        'You are not the owner of this deal or not authorized to view it',
        403,
      );
    }

    return deal;
  }
}

module.exports = DealService;
