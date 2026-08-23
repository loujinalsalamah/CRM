const { z } = require('zod');

const createVisitorSessionSchema = z.object({
  ip: z.string(),
});

module.exports = {
  createVisitorSessionSchema,
};
