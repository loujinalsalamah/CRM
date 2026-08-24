class DealRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createSaleLeaseDeal(data) {
    return this.prisma.$transaction(async (tx) => {
      const deal = await tx.saleLeaseDeal.create({
        data,
        select: {
          id: true,
          employee: { select: { userId: true } },
        },
      });

      await tx.request.updateMany({
        where: {
          propertyId: data.propertyId,
          status: 'COMPLETED',
          isDealCreated: false,
        },
        data: {
          isDealCreated: true,
        },
      });

      return deal;
    });
  }

  createBuyRentDeal(data) {
    return this.prisma.$transaction(async (tx) => {
      const deal = await tx.buyRentDeal.create({
        data,
        select: {
          id: true,
          employee: { select: { userId: true } },
        },
      });

      await tx.request.updateMany({
        where: {
          propertyId: data.propertyId,
          status: 'COMPLETED',
          isDealCreated: false,
        },
        data: {
          isDealCreated: true,
        },
      });

      return deal;
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

  completeBuyRentDealTransaction({ id, propertyId, actualPrice }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.buyRentDeal.update({
        where: { id },
        data: { dealStatus: 'COMPLETED' },
      });

      await tx.property.update({
        where: { id: propertyId },
        data: {
          actualPrice,
          status: 'OUT_OF_REACH',
        },
      });
    });
  }

  completeSaleLeaseDealTransaction({
    id,
    propertyId,
    actualProfitMargin,
    actualListingPrice,
    actualPrice,
  }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.saleLeaseDeal.update({
        where: { id },
        data: {
          actualProfitMargin,
          actualListingPrice,
          dealStatus: 'COMPLETED',
        },
      });

      const calculatedListedPrice = actualPrice * (1 + actualListingPrice);

      await tx.property.update({
        where: { id: propertyId },
        data: {
          actualPrice,
          listedPrice: calculatedListedPrice,
          status: 'AVAILABLE',
        },
      });
    });
  }

  failBuyRentDealTransaction({ id, propertyId }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.buyRentDeal.update({
        where: { id },
        data: { dealStatus: 'FAILED' },
      });

      await tx.property.update({
        where: { id: propertyId },
        data: { status: 'AVAILABLE' },
      });

      await tx.request.updateMany({
        where: {
          propertyId: propertyId,
          status: 'COMPLETED',
        },
        data: {
          status: 'REJECTED',
        },
      });
    });
  }

  failSaleLeaseDealTransaction({ id, propertyId }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.saleLeaseDeal.update({
        where: { id },
        data: { dealStatus: 'FAILED' },
      });

      await tx.property.update({
        where: { id: propertyId },
        data: { status: 'OUT_OF_REACH' },
      });

      await tx.request.updateMany({
        where: {
          propertyId: propertyId,
          status: 'COMPLETED',
        },
        data: {
          status: 'REJECTED',
        },
      });
    });
  }

  findMyBuyRentDeals(employeeId) {
    return this.prisma.buyRentDeal.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        dealStatus: true,
        createdAt: true,
        client: {
          select: {
            name: true,
            photo: true,
          },
        },
        property: {
          select: {
            type: true,
            fullDescription: true,
            city: true,
            location: true,
            actualPrice: true,
          },
        },
      },
    });
  }

  findMySaleLeaseDeals(employeeId) {
    return this.prisma.saleLeaseDeal.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        dealStatus: true,
        createdAt: true,
        maxPhasedPrice: true,
        client: {
          select: {
            name: true,
            photo: true,
          },
        },
        property: {
          select: {
            type: true,
            fullDescription: true,
            city: true,
            location: true,
          },
        },
      },
    });
  }
}

module.exports = DealRepository;
