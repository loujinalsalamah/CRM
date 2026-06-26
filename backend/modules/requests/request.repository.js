const APIFeatures = require('../../utils/apiFeatures');

class RequestRepository {
  constructor(prisma) {
    this.requestModel = prisma.request;
  }

  createRequest(data) {
    return this.requestModel.create({
      data,
    });
  }

  findAllConsultantRequests(employeeId, queryString) {
    let features = new APIFeatures(queryString);

    const select = {
      status: true,
      sellData: true,
      createdAt: true,
      client: {
        select: {
          name: true,
          photo: true,
        },
      },
    };

    features = features.filter();
    features = features.sort();

    features.options.select = select;
    features.options.where.employeeId = employeeId;
    return this.requestModel.findMany(features.options);
  }

  findRequestById(id) {
    return this.requestModel.findUnique({
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
      },
    });
  }
}

module.exports = RequestRepository;
