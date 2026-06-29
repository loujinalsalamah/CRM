const APIFeatures = require('../../utils/apiFeatures');

class RequestRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createRequest(data) {
    return this.prisma.request.create({ data });
  }

  findAllRequests(queryString) {
    let features = new APIFeatures(queryString);

    const select = {
      id: true,
      type: true,
      message: true,
      client: {
        select: {
          name: true,
          photo: true,
        },
      },
      property: {
        select: {
          referenceCode: true,
          location: true,
          listedPrice: true,
          simpleDescription: true,
        },
      },
    };

    features = features.filter();
    features = features.sort();
    features = features.paginate();

    features.options.where.status = 'COMPLETED';
    features.options.select = select;
    return this.prisma.request.findMany(features.options);
  }

  findAllConsultantRequests(employeeId, queryString) {
    let features = new APIFeatures(queryString);

    const select = {
      id: true,
      type: true,
      status: true,
      sellData: true,
      createdAt: true,
      client: {
        select: {
          id: true,
          name: true,
          photo: true,
          userId: true,
        },
      },
    };

    features = features.filter();
    features = features.sort();

    features.options.select = select;
    features.options.where.employeeId = employeeId;
    return this.prisma.request.findMany(features.options);
  }

  findRequestById(id) {
    return this.prisma.request.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        status: true,
        sellData: true,
        message: true,
        notes: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            location: true,
            name: true,
            phone: true,
            userId: true,
          },
        },
        propertyId: true,
      },
    });
  }

  findDuplicateRequest(propertyId, clientId) {
    return this.prisma.request.findFirst({
      where: {
        propertyId,
        clientId,
      },
    });
  }

  countRequestsByStatus(employeeId, status) {
    return this.prisma.request.count({ where: { employeeId, status } });
  }

  updateRequest(id, data) {
    return this.prisma.request.update({ where: { id }, data });
  }
}

module.exports = RequestRepository;
