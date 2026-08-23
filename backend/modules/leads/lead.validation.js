const { z } = require('zod');

const createLeadSchema = z.object({
  visitorSessionId: z.string().uuid(),
});

const updateLeadSchema = z.object({
  visitorSessionId: z.string().uuid(),
  budget: z.number().nonnegative(),
  source: z.string().min(3).max(20),
});

module.exports = {
  createLeadSchema,

  updateLeadSchema,
};
