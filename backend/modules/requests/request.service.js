const AppError = require('../../utils/appError');

class RequestService {
  constructor(requestRepository, employeeRepository, propertyRepository) {
    this.requestRepository = requestRepository;
    this.employeeRepository = employeeRepository;
    this.propertyRepository = propertyRepository;
  }

  async createSellRequest(clientId, data) {
    const employee = await this.employeeRepository.findBestConsultant();
    data = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...data,
      clientId,
      employeeId: employee.id,
    };

    return this.requestRepository.createRequest(data);
  }

  async createBuyRequest(clientId, data) {
    data = { ...data, clientId };

    const { propertyId } = data;

    const property = await this.propertyRepository.findPropertyById(propertyId);

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (!property.status === 'AVAILABLE') {
      throw new AppError('Property is not available', 400);
    }

    const request = await this.requestRepository.findDuplicateRequest(
      propertyId,
      clientId,
    );

    if (request) {
      throw new AppError(
        'You have already submitted a request for this property',
        400,
      );
    }
    return this.requestRepository.createRequest({
      ...data,
      status: 'COMPLETED',
    });
  }

  getAllRequests(queryString) {
    return this.requestRepository.findAllRequests(queryString);
  }

  async getMyRequests(employeeId, queryString) {
    const requests = await this.requestRepository.findAllConsultantRequests(
      employeeId,
      queryString,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const request of requests) {
      const sellData = {
        type: request.sellData.type,
        price: request.sellData.price,
      };

      request.sellData = sellData;
    }

    return requests;
  }

  async getRequestById(id) {
    const request = await this.requestRepository.findRequestById(id);

    if (!request) {
      throw new AppError('No request found with that id', 404);
    }

    return request;
  }

  async getRequestsStats(employeeId) {
    const newRequests = await this.requestRepository.countRequestsByStatus(
      employeeId,
      'PENDING',
    );

    const inProgressRequests =
      await this.requestRepository.countRequestsByStatus(
        employeeId,
        'IN_PROGRESS',
      );

    const completeRequests = await this.requestRepository.countRequestsByStatus(
      employeeId,
      'COMPLETED',
    );

    const rejectRequests = await this.requestRepository.countRequestsByStatus(
      employeeId,
      'REJECTED',
    );

    return {
      newRequests,
      completeRequests,
      rejectRequests,
      inProgressRequests,
    };
  }
}
module.exports = RequestService;
