class ClientRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  updateClient(id, data) {
    return this.prisma.client.update({ where: { id }, data });
  }
}

module.exports = ClientRepository;
