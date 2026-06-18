const AppError = require('../../utils/appError');

class RequestService {
  constructor(requestRepository, employeeRepository) {
    this.requestRepository = requestRepository;
    this.employeeRepository = employeeRepository;
  }

  async createRequest(clientId, data) {
    if (data.type === 'SELL' || data.type === 'RENT') {
      const employee = await this.employeeRepository.findBestConsultant();
      data = {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...data,
        clientId,
        employeeId: employee.id,
      };
    } else {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      data = { ...data, clientId };
    }
    return this.requestRepository.createRequest(data);
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
}
module.exports = RequestService;
