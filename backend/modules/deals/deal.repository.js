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

  async findDealByIdFromBothTables(id) {
    const buyRentDeal = await this.prisma.buyRentDeal.findUnique({
      where: { id },
      select: {
        id: true,
        dealType: true,
        dealStatus: true,
        createdAt: true,
        propertyId: true,
        clientId: true,
        employeeId: true,
        property: {
          select: {
            id: true,
            listedPrice: true,
            actualPrice: true,
          },
        },
      },
    });

    if (buyRentDeal) {
      return buyRentDeal;
    }

    const saleLeaseDeal = await this.prisma.saleLeaseDeal.findUnique({
      where: { id },
      select: {
        id: true,
        maxPhasedPrice: true,
        minListingPrice: true,
        maxListingPrice: true,
        profitMargin: true,
        dealType: true,
        dealStatus: true,
        propertyId: true,
        clientId: true,
        employeeId: true,
        rentalPeriod: true,
        createdAt: true,
      },
    });

    if (saleLeaseDeal) {
      return saleLeaseDeal;
    }

    return null;
  }

  changePropertyTransaction(id, oldPropertyId, newPropertyId) {
    return this.prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id: newPropertyId },
        data: { status: 'NOT_AVAILABLE' },
      });

      await tx.property.update({
        where: { id: oldPropertyId },
        data: { status: 'AVAILABLE' },
      });

      return await tx.buyRentDeal.update({
        where: { id },
        data: { propertyId: newPropertyId },
      });
    });
  }

  changeEmployeeTransaction({
    id,
    newEmployeeId,
    modelType,
    scheduleForeignKey,
  }) {
    return this.prisma.$transaction(async (tx) => {
      await tx[modelType].update({
        where: { id },
        data: { employeeId: newEmployeeId },
      });

      await tx.schedule.updateMany({
        where: {
          [scheduleForeignKey]: id,
        },
        data: {
          employeeId: newEmployeeId,
        },
      });
    });
  }
}

module.exports = DealRepository;
