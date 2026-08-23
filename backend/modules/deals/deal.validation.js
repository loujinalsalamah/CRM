const { z } = require('zod');

const dealIdSchema = z
  .object({
    id: z.string().uuid().optional(),
    dealId: z.string().uuid().optional(),
  })
  .refine((data) => data.id || data.dealId, {
    message: 'Either id or dealId must be provided',
    path: ['id'],
  });

const createSaleLeaseDealSchema = z.object({
  maxPhasedPrice: z.number().positive(),
  minListingPrice: z.number().positive(),
  maxListingPrice: z.number().positive(),
  propertyId: z.string().uuid(),
  clientId: z.string().uuid(),
  employeeId: z.string().uuid(),
  dealType: z.enum(['SALE', 'LEASE']),
  rentalPeriod: z.number().optional(),
});

const createBuyRentDealSchema = z.object({
  propertyId: z.string().uuid(),
  clientId: z.string().uuid(),
  employeeId: z.string().uuid(),
  dealType: z.enum(['BUY', 'RENT']),
});

module.exports = {
  dealIdSchema,
  createSaleLeaseDealSchema,
  createBuyRentDealSchema,
};
