class ClientService {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  updateMe(clientId, data) {
    return this.clientRepository.updateClient(clientId, data);
  }
}

module.exports = ClientService;
