/* eslint-disable no-restricted-syntax */
const AppError = require('../../utils/appError');

class ClientService {
  constructor(clientRepository, propertyRepository) {
    this.clientRepository = clientRepository;
    this.propertyRepository = propertyRepository;
  }

  updateMe(clientId, data) {
    return this.clientRepository.updateClient(clientId, data);
  }

  async getMyFavorite(clientId, queryString) {
    const client = await this.clientRepository.findClientById(clientId);

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    if (
      !client.favoritePropertyIds ||
      client.favoritePropertyIds.length === 0
    ) {
      return [];
    }

    const properties = await this.propertyRepository.findPropertiesByIds(
      client.favoritePropertyIds,
      queryString,
    );

    for (const property of properties) {
      property.bathrooms = Math.floor(property.bathrooms);
    }

    return properties;
  }

  async addToFavorite(clientId, data) {
    const client = await this.clientRepository.findClientById(clientId);

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    if (client.favoritePropertyIds.includes(data.propertyId)) {
      throw new AppError('Property already added to your favorites', 400);
    }

    const updatePayload = {
      favoritePropertyIds: {
        push: data.propertyId,
      },
    };

    return this.clientRepository.updateClient(clientId, updatePayload);
  }

  async removeFromFavorite(clientId, data) {
    const client = await this.clientRepository.findClientById(clientId);

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    if (!client.favoritePropertyIds.includes(data.propertyId)) {
      throw new AppError('Property not found in your favorites', 400);
    }

    const updatedIds = client.favoritePropertyIds.filter(
      (id) => id !== data.propertyId,
    );

    const updatePayload = {
      favoritePropertyIds: updatedIds,
    };

    return this.clientRepository.updateClient(clientId, updatePayload);
  }
}

module.exports = ClientService;
