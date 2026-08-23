const AppError = require('../../utils/appError');

class LeadService {
  constructor(leadRepository) {
    this.leadRepository = leadRepository;
  }

  async createLead(data) {
    const visitorSession = await this.leadRepository.createLead(data);

    if (!visitorSession) {
      throw new AppError('Visitor session not found', 404);
    }

    if (!visitorSession.islead) {
      throw new AppError(
        'Visitor session could not be converted to a lead',
        400,
      );
    }

    return visitorSession;
  }

  async updateLead(data) {
    const { visitorSessionId } = data;
    delete data.visitorSessionId;

    const updatedLead = await this.leadRepository.updateLead(
      visitorSessionId,
      data,
    );

    if (!updatedLead) {
      throw new AppError('Lead not found', 404);
    }
  }
}

module.exports = LeadService;
