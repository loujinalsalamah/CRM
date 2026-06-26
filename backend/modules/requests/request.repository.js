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
            location: true, // تم تعديل L إلى l صغيرة هنا
            name: true,
            phone: true,
            userId: true,
          },
        },
      },
    });
  }

  findDuplicateRequest(propertyId, clientId) {
    return this.requestModel.findFirst({
      where: {
        propertyId,
        clientId,
      },
    });
  }
}

module.exports = RequestRepository;
