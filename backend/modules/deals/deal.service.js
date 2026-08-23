const AppError = require('../../utils/appError');

class DealService {
  constructor(dealRepository, notificationService, propertyRepository) {
    this.dealRepository = dealRepository;
    this.notificationService = notificationService;
    this.propertyRepository = propertyRepository;
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

  async changeProperty(id, data, user) {
    const deal = await this.dealRepository.findDealByIdFromBothTables(id);

    if (!deal) {
      throw new AppError('Deal not found', 404);
    }

    if (deal.employeeId !== user.employee.id) {
      throw new AppError(
        'You are not the owner of this deal or not authorized to change the property',
        403,
      );
    }

    if (deal.dealType !== 'BUY' && deal.dealType !== 'RENT') {
      throw new AppError(
        'Property change is only allowed for BUY or RENT deals',
        400,
      );
    }

    if (deal.dealStatus !== 'FRESH') {
      throw new AppError(
        'Only fresh deals can have their property changed',
        400,
      );
    }

    if (deal.propertyId === data.propertyId) {
      throw new AppError('The deal is already linked to this property', 400);
    }

    const property = await this.propertyRepository.findPropertyById(
      data.propertyId,
    );

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.status !== 'AVAILABLE') {
      throw new AppError('The new property is not available for deals', 400);
    }

    if (deal.dealType === 'BUY' && property.listingType === 'LEASE') {
      throw new AppError('Cannot link a BUY deal to a LEASE property', 400);
    }

    if (deal.dealType === 'RENT' && property.listingType === 'SALE') {
      throw new AppError('Cannot link a RENT deal to a SALE property', 400);
    }

    await this.dealRepository.changePropertyTransaction(
      id,
      deal.propertyId,
      data.propertyId,
    );
  }
}

module.exports = DealService;
