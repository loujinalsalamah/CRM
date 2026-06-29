class ClientRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findClientById(id) {
    return this.prisma.client.findUnique({ where: { id } });
  }

  updateClient(id, data) {
    return this.prisma.client.update({ where: { id }, data });
  }
}

module.exports = ClientRepository;
