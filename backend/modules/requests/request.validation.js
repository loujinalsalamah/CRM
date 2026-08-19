const { z } = require('zod');

// eslint-disable-next-line no-unused-vars
const requestTypeEnum = z.enum(['SELL', 'BUY', 'RENT', 'LEASE']);

const createSellRequestSchema = z.object({
  type: z.literal(['SELL', 'RENT']),
  message: z.string().optional(),
  sellData: z.object(),
});

const createBuyRequestSchema = z.object({
  type: z.literal(['BUY', 'LEASE']),
  message: z.string().optional(),
  propertyId: z.string().uuid(),
});

const requestIdSchema = z
  .object({
    id: z.string().uuid().optional(),
    requestId: z.string().uuid().optional(),
  })
  .refine((data) => data.id || data.requestId, {
    message: 'Either id or requestId must be provided',
    path: ['id'],
  });

module.exports = {
  createSellRequestSchema,
  createBuyRequestSchema,
  requestIdSchema,
};
