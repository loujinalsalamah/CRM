/* eslint-disable node/no-unsupported-features/es-syntax */
class DashboardRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getDateFilter(queryString) {
    const dateFilter = {};
    const from = queryString && queryString.from;
    const to = queryString && queryString.to;

    if (from) dateFilter.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      if (/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        toDate.setUTCHours(23, 59, 59, 999);
      }
      dateFilter.lte = toDate;
    }

    return Object.keys(dateFilter).length
      ? { createdAt: dateFilter }
      : undefined;
  }

  countProperties(dateFilter) {
    return this.prisma.property.count({ where: dateFilter });
  }

  countPropertiesByStatus(dateFilter, status) {
    return this.prisma.property.count({
      where: { ...dateFilter, status },
    });
  }

  countPropertiesByListingType(dateFilter, listingType) {
    return this.prisma.property.count({
      where: { ...dateFilter, listingType },
    });
  }

  countPropertiesByType(dateFilter) {
    return this.prisma.property.groupBy({
      by: ['type'],
      where: dateFilter,
      _count: { id: true },
      orderBy: { type: 'asc' },
    });
  }

  countPropertiesByCity(dateFilter) {
    return this.prisma.property.groupBy({
      by: ['city'],
      where: dateFilter,
      _count: { id: true },
      orderBy: { city: 'asc' },
    });
  }

  countPropertiesByTypeAndCity(dateFilter) {
    return this.prisma.property.groupBy({
      by: ['type', 'city'],
      where: dateFilter,
      _count: { id: true },
      orderBy: [{ city: 'asc' }, { type: 'asc' }],
    });
  }

  findSaleLeaseDealsForDashboard(dateFilter) {
    return this.prisma.saleLeaseDeal.findMany({
      where: dateFilter,
      select: {
        dealType: true,
        dealStatus: true,
        property: {
          select: {
            city: true,
            type: true,
          },
        },
      },
    });
  }

  findBuyRentDealsForDashboard(dateFilter) {
    return this.prisma.buyRentDeal.findMany({
      where: dateFilter,
      select: {
        dealType: true,
        dealStatus: true,
        property: {
          select: {
            city: true,
            type: true,
          },
        },
      },
    });
  }

  countEmployees(dateFilter) {
    return this.prisma.employee.count({
      where: {
        role: { notIn: ['GENERAL_MANAGER', 'SALES_MANAGER'] },
        ...dateFilter,
      },
    });
  }

  countEmployeesByRole(role) {
    return this.prisma.employee.count({
      where: {
        role,
      },
    });
  }
}

module.exports = DashboardRepository;
