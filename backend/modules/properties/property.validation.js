const { z } = require('zod');

const PropertyType = z.enum(['APARTMENT', 'VILLA', 'HOUSE', 'STORE', 'HALL']);
const ListingType = z.enum(['SALE', 'LEASE']);
const StatusEnum = z.enum(['AVAILABLE', 'NOT_AVAILABLE']);
const FurnishingType = z.enum([
  'FULLY_FURNISHED',
  'SEMI_FURNISHED',
  'UNFURNISHED',
]);
const RoomType = z.enum([
  'BEDROOM',
  'MASTER_BEDROOM',
  'ENSUITE_BATHROOM',
  'BATHROOM',
  'LIVING_ROOM',
  'GUEST_BEDROOM',
  'FAMILY_ROOM',
  'KITCHEN',
  'DINING_ROOM',
  'FOYER',
  'POWDER_ROOM',
  'OTHER',
]);
const OutdoorItemType = z.enum([
  'POOL',
  'GARDEN',
  'OUTDOOR_AREA',
  'EXTERNAL_GARAGE',
  'OTHER',
]);

const createPropertySchema = z.object({
  requestId: z.string().uuid(),
  zipCode: z.number(),
  type: PropertyType,
  listingType: ListingType,
  simpleDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  location: z.string(),
  city: z.string(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  sqft: z.number(),
  heating: StatusEnum,
  furnishing: FurnishingType,
  buildingNumber: z.string(),
  overAllQual: z.number().int().min(1).max(20),
  overAllcond: z.number().int().min(1).max(20),
  garageCars: z.number().optional(),
  numOfFloors: z.number().int().optional(),
  floorNumber: z.number().int().optional(),
  elevator: z.boolean().optional(),
  parking: StatusEnum.optional(),
  fireplace: z.boolean(),
  hasBasement: z.boolean(),
  basementArea: z.number().optional(),
  primaryPhoto: z.string().url(),
  galleryPhoto: z.array(z.string().url()),
  nearbyPlaces: z.object({}).passthrough().optional(),

  finishingQuality: z.number().int().min(1).max(5),
  maintenanceLevel: z.number().int().min(1).max(5),
  neighborhoodScore: z.number().min(0).max(5),
  exteriorFinish: z.number().int().min(1).max(5),

  constructionYear: z.number().int(),

  roomItems: z.array(
    z.object({
      type: RoomType,
      size: z.number(),
      data: z.object({}).passthrough().optional(),
      photos: z.array(z.string().url()),
      description: z.string().optional(),
      paintDescription: z.string(),
      hasBalcony: z.boolean().optional(),
      balconyData: z.object({}).passthrough().optional(),
      bathroomWeight: z.number().optional(),
    }),
  ),

  outdoorItems: z.array(
    z.object({
      type: OutdoorItemType,
      data: z.object({}).passthrough().optional(),
      description: z.string().optional(),
      photos: z.array(z.string().url()),
    }),
  ),
});

const propertyIdSchema = z.object({
  id: z.string().uuid(),
});

const createPricingPolicySchema = z.object({
  city: z.string(),
  propertyType: PropertyType,
  sellProfitMargin: z.number(),
  rentProfitMargin: z.number(),
  saleGlobalAdjust: z.number(),
  rentGlobalAdjust: z.number(),
  saleListingMargin: z.number(),
  rentListingMargin: z.number(),
});

const updatePricingPolicySchema = z.object({
  sellProfitMargin: z.number().optional(),
  rentProfitMargin: z.number().optional(),
  saleGlobalAdjust: z.number().optional(),
  rentGlobalAdjust: z.number().optional(),
  saleListingMargin: z.number().optional(),
  rentListingMargin: z.number().optional(),
});

const pricingPolicyIdSchema = z.object({
  id: z.string().uuid(),
});

module.exports = {
  createPropertySchema,
  propertyIdSchema,
  createPricingPolicySchema,
  updatePricingPolicySchema,
  pricingPolicyIdSchema,
};
