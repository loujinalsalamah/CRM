class VisitorService {
  constructor(visitorRepository) {
    this.visitorRepository = visitorRepository;
  }

  createVisitorSession(data) {
    return this.visitorRepository.createVisitorSession(data);
  }
}

module.exports = VisitorService;
