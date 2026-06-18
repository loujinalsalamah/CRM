/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.options = {};
  }

  // ?price[gte]=1000  &  price[lte]=5000  &  name=Hotel
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['orderBy', 'select', 'cursor', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const parsedQuery = {};

    for (const key in queryObj) {
      const value = queryObj[key];

      const match = key.match(/^(\w+)\[(\w+)\]$/);

      if (match) {
        const field = match[1];
        const operator = match[2];

        if (!parsedQuery[field]) parsedQuery[field] = {};
        parsedQuery[field][operator] = value;
      } else {
        parsedQuery[key] = value;
      }
    }

    this.options.where = {};

    for (const field in parsedQuery) {
      const value = parsedQuery[field];
      if (typeof value === 'object') {
        this.options.where[field] = {};

        for (const op in value) {
          const parsed = Number(value[op]);
          this.options.where[field][op] = Number.isNaN(parsed)
            ? value[op]
            : parsed;
        }
      } else {
        const parsed = Number(value);
        this.options.where[field] = Number.isNaN(parsed) ? value : parsed;
      }
    }

    return this;
  }

  // ?orderBy=age:asc,price:desc
  sort() {
    if (this.queryString.orderBy) {
      const fields = this.queryString.orderBy.split(',');

      this.options.orderBy = fields.map((el) => {
        const [field, direction] = el.split(':');
        return { [field]: direction };
      });
    } else {
      this.options.orderBy = [{ createdAt: 'desc' }];
    }

    return this;
  }

  limitFields() {
    if (this.queryString.select) {
      const fields = this.queryString.select.split(',');

      this.options.select = {};

      fields.forEach((field) => {
        this.options.select[field] = true;
      });
    }

    return this;
  }

  paginate() {
    this.options.take = Number(this.queryString.limit) || 20;

    if (this.queryString.cursor) {
      this.options.skip = 1;
      this.options.cursor = { id: this.queryString.cursor };
    }

    return this;
  }
}

module.exports = APIFeatures;
