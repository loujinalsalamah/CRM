const AppError = require('../../utils/appError');

class PropertyController {
  constructor(propertyService) {
    this.propertyService = propertyService;

    this.createProperty = this.createProperty.bind(this);
    this.getAllProperties = this.getAllProperties.bind(this);
    this.getProperty = this.getProperty.bind(this);
    this.searchProperties = this.searchProperties.bind(this);
  }

  async createProperty(req, res, next) {
    const data = req.body;
    const property = await this.propertyService.createProperty(data);

    if (!property) {
      return next(new AppError('Failed to create property', 404));
    }

    res.status(201).json({
      status: 'success',
      message: 'property created successfully',
    });
  }

  async getAllProperties(req, res, next) {
    const queryString = req.query;
    const properties = await this.propertyService.getAllProperties(queryString);

    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: properties,
    });
  }

  async getProperty(req, res, next) {
    const { id } = req.params;
    const property = await this.propertyService.getProperty(id);

    if (!property) {
      return next(new AppError('No Property found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: property,
    });
  }

  async searchProperties(req, res, next) {
    const { q } = req.query;
    const queryString = req.query;
    delete queryString.q;

    if (!q || q.trim() === '') {
      return res.json({
        status: 'success',
        results: 0,
        data: [],
      });
    }

    const cleanedQuery = q.trim();

    const tokens = cleanedQuery.split(' ').filter(Boolean);

    const searchableFields = [
      'simpleDescription',
      'fullDescription',
      'address',
      'city',
      'referenceCode',
    ];

    const orConditions = [];

    tokens.forEach((token) => {
      searchableFields.forEach((field) => {
        orConditions.push({
          [field]: {
            contains: token,
            mode: 'insensitive',
          },
        });
      });
    });

    const properties = await this.propertyService.searchProperties(
      queryString,
      orConditions,
    );

    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: properties,
    });
  }
}
module.exports = PropertyController;
