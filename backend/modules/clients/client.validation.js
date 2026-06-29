const { z } = require('zod');

const updateMeSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  photo: z.string().optional(),
});

const favoriteIdSchema = z.object({
  propertyId: z.string().uuid(),
});

module.exports = {
  updateMeSchema,
  favoriteIdSchema,
};
