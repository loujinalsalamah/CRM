const { z } = require('zod');

const dealIdSchema = z.object({
  dealId: z.string().uuid(),
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
