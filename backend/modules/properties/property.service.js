/* eslint-disable prefer-destructuring */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-restricted-syntax */

class PropertyService {
  constructor(propertyRepository, requestRepository) {
    this.propertyRepository = propertyRepository;
    this.requestRepository = requestRepository;
  }

  async createProperty(data) {
    const requestId = data.requestId;
    delete data.requestId;

    const request = await this.requestRepository.findRequestById(requestId);

    //bathrooms weight
    let numOfRooms = 0;
    let bathrooms = 0.0;
    for (const roomItem of data.roomItems) {
      if (roomItem.type === 'POWDER_ROOM') {
        roomItem.bathroomWeight = 0.5;
      } else if (
        roomItem.type === 'BATHROOM' ||
        roomItem.type === 'ENSUITE_BATHROOM'
      ) {
        roomItem.bathroomWeight = 1;
      } else {
        roomItem.bathroomWeight = 0;
        if (
          roomItem.type !== 'KITCHEN' ||
          roomItem.type !== 'FOYER' ||
          roomItem.type !== 'OTHER'
        ) {
          numOfRooms += 1;
        }
      }

      //bathrooms
      bathrooms += roomItem.bathroomWeight;
    }

    //NumOfRooms
    data.numOfRooms = numOfRooms;

    //bathrooms
    data.bathrooms = bathrooms;

    //referenceCode
    const count = await this.propertyRepository.countByType(data.type);

    data.referenceCode = `${data.type[0]}-${count + 1}`;

    return this.propertyRepository.createProperty(requestId, {
      ...data,
      listedPrice: 7000.0,
      clientId: request.clientId,
    });
  }

  async getAllProperties(queryString) {
    const properties =
      await this.propertyRepository.findAllProperties(queryString);

    for (const property of properties) {
      property.bathrooms = Math.floor(property.bathrooms);
    }
    return properties;
  }

  async getProperty(id) {
    const property = await this.propertyRepository.findPropertyById(id);

    return property;
  }

  searchProperties(queryString, orConditions) {
    const properties = this.propertyRepository.findPropertiesBySearch(
      queryString,
      orConditions,
    );
    return properties;
  }
}
module.exports = PropertyService;
