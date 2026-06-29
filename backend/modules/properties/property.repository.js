/* eslint-disable node/no-unsupported-features/es-syntax */
const APIFeatures = require('../../utils/apiFeatures');

class PropertyRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllProperties(queryString) {
    queryString.select =
      'id,referenceCode,type,listingType,simpleDescription,city,listedPrice,sqft,numOfRooms,bathrooms,primaryPhoto';

    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.limitFields();
    features = features.paginate();

    return this.prisma.property.findMany(features.options);
  }

  findPropertyById(id) {
    return this.prisma.property.findUnique({
      where: { id },
      include: { roomItems: true, outdoorItems: true },
    });
  }

  createProperty(requestId, data) {
    return this.prisma.property.create({
      data: {
        ...data,
        requests: requestId ? { connect: { id: requestId } } : undefined,
        roomItems: { create: data.roomItems },
        outdoorItems: { create: data.outdoorItems },
      },
      include: { roomItems: true, outdoorItems: true },
    });
  }

  findPropertiesBySearch(queryString, orConditions) {
    queryString.select =
      'id,referenceCode,type,listingType,simpleDescription,city,listedPrice,sqft,numOfRooms,bathrooms,primaryPhoto';

    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.limitFields();
    features = features.paginate();

    features.options.where.OR = orConditions;
    const properties = this.prisma.property.findMany(features.options);
    return properties;
  }

  countByType(type) {
    return this.prisma.property.count({
      where: { type },
    });
  }

  findPropertiesByIds(ids, queryString) {
    queryString.select =
      'id,referenceCode,type,listingType,simpleDescription,city,listedPrice,sqft,numOfRooms,bathrooms,primaryPhoto';

    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.limitFields();
    features = features.paginate();

    features.options.where.id = { in: ids };

    return this.prisma.property.findMany(features.options);
  }
}
module.exports = PropertyRepository;
