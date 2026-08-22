class DealRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createSaleLeaseDeal(data) {
    return this.prisma.saleLeaseDeal.create({
      data,
      select: {
        id: true,
        employee: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  createBuyRentDeal(data) {
    return this.prisma.buyRentDeal.create({
      data,
      select: {
        id: true,
        employee: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  findSaleLeaseDealByPropertyId(propertyId) {
    return this.prisma.saleLeaseDeal.findFirst({
      where: { propertyId },
    });
  }

  findActiveBuyRentDealByPropertyId(propertyId) {
    return this.prisma.buyRentDeal.findFirst({
      where: {
        propertyId,
        dealStatus: { in: ['FRESH', 'NEGOTIATING'] },
      },
    });
  }
}

module.exports = DealRepository;
