/* eslint-disable node/no-unsupported-features/es-syntax */
class DashboardService {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async getDashboard(queryString) {
    const dateFilter = this.dashboardRepository.getDateFilter(queryString);
    const openStatuses = ['FRESH', 'NEGOTIATING'];
    const successfulStatuses = ['COMPLETED'];
    const failedStatuses = ['FAILED'];

    const [
      total,
      available,
      forSale,
      forLease,
      byType,
      byCity,
      byTypeAndCity,
      deals,
      employees,
    ] = await Promise.all([
      this.dashboardRepository.countProperties(dateFilter),
      this.dashboardRepository.countPropertiesByStatus(dateFilter, 'AVAILABLE'),
      this.dashboardRepository.countPropertiesByListingType(dateFilter, 'SALE'),
      this.dashboardRepository.countPropertiesByListingType(
        dateFilter,
        'LEASE',
      ),
      this.dashboardRepository.countPropertiesByType(dateFilter),
      this.dashboardRepository.countPropertiesByCity(dateFilter),
      this.dashboardRepository.countPropertiesByTypeAndCity(dateFilter),
      this.getDealsDashboard(
        dateFilter,
        openStatuses,
        successfulStatuses,
        failedStatuses,
      ),
      this.getEmployeesDashboard(dateFilter),
    ]);

    return {
      properties: {
        total,
        available,
        forSale,
        forLease,
        byType: byType.map((item) => ({
          type: item.type,
          count: item._count.id,
        })),
        byCity: byCity.map((item) => ({
          city: item.city,
          count: item._count.id,
        })),
        byTypeAndCity: byTypeAndCity.map((item) => ({
          type: item.type,
          city: item.city,
          count: item._count.id,
        })),
      },
      deals,
      employees,
    };
  }

  async getDealsDashboard(
    dateFilter,
    openStatuses,
    successfulStatuses,
    failedStatuses,
  ) {
    const dealRows = await Promise.all([
      this.dashboardRepository.findSaleLeaseDealsForDashboard(dateFilter),
      this.dashboardRepository.findBuyRentDealsForDashboard(dateFilter),
    ]);
    const allDeals = dealRows.flat();
    const summary = this.getDealSummary(
      allDeals,
      openStatuses,
      successfulStatuses,
      failedStatuses,
    );

    return {
      ...summary,
      byCity: this.getDealBreakdown(
        allDeals,
        (deal) => deal.property.city,
        openStatuses,
        successfulStatuses,
        failedStatuses,
        'city',
      ),
      byPropertyType: this.getDealBreakdown(
        allDeals,
        (deal) => deal.property.type,
        openStatuses,
        successfulStatuses,
        failedStatuses,
        'type',
      ),
      byCityAndPropertyType: this.getDealBreakdown(
        allDeals,
        (deal) => `${deal.property.city}|${deal.property.type}`,
        openStatuses,
        successfulStatuses,
        failedStatuses,
        'cityAndPropertyType',
        (deal) => ({
          city: deal.property.city,
          propertyType: deal.property.type,
        }),
      ),
      byDealType: this.getDealBreakdown(
        allDeals,
        (deal) => deal.dealType,
        openStatuses,
        successfulStatuses,
        failedStatuses,
        'dealType',
      ),
    };
  }

  async getEmployeesDashboard(dateFilter) {
    const [total, buy, sales, rentLease, inspectors] = await Promise.all([
      this.dashboardRepository.countEmployees(dateFilter),
      this.dashboardRepository.countEmployeesByRole('PURCHASING'),
      this.dashboardRepository.countEmployeesByRole('SALES'),
      this.getRentLeaseEmployeesCount(),
      this.dashboardRepository.countEmployeesByRole('CONSULTANT'),
    ]);

    return {
      total,
      buy,
      sales,
      rentLease,
      inspectors,
    };
  }

  async getRentLeaseEmployeesCount() {
    const [rental, lease] = await Promise.all([
      this.dashboardRepository.countEmployeesByRole('RENTAL'),
      this.dashboardRepository.countEmployeesByRole('LEASE'),
    ]);

    return rental + lease;
  }

  getDealSummary(deals, openStatuses, successfulStatuses, failedStatuses) {
    const summary = deals.reduce(
      (result, deal) => {
        result.total += 1;
        if (openStatuses.includes(deal.dealStatus)) result.open += 1;
        if (successfulStatuses.includes(deal.dealStatus)) {
          result.successful += 1;
        }
        if (failedStatuses.includes(deal.dealStatus)) result.failed += 1;
        return result;
      },
      { total: 0, open: 0, successful: 0, failed: 0 },
    );

    return {
      ...summary,
      successRate:
        summary.successful + summary.failed
          ? Number(
              (
                (summary.successful / (summary.successful + summary.failed)) *
                100
              ).toFixed(2),
            )
          : 0,
    };
  }

  getDealBreakdown(
    deals,
    getKey,
    openStatuses,
    successfulStatuses,
    failedStatuses,
    keyName,
    getLabel,
  ) {
    const result = {};
    deals.forEach((deal) => {
      const key = getKey(deal);
      if (!result[key]) {
        result[key] = { total: 0, open: 0, successful: 0, failed: 0 };
      }
      result[key].total += 1;
      if (openStatuses.includes(deal.dealStatus)) result[key].open += 1;
      if (successfulStatuses.includes(deal.dealStatus)) {
        result[key].successful += 1;
      }
      if (failedStatuses.includes(deal.dealStatus)) result[key].failed += 1;
    });

    return Object.entries(result).map(([key, counts]) => ({
      ...(getLabel
        ? getLabel(deals.find((deal) => getKey(deal) === key))
        : {
            [keyName]: key,
          }),
      ...counts,
    }));
  }
}

module.exports = DashboardService;
