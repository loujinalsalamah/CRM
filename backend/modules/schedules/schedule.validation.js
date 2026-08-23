const { z } = require('zod');

// eslint-disable-next-line no-unused-vars
const ScheduleTypeEnum = z.enum([
  'PERSONAL',
  'BUY_RENT_DEAL',
  'SALE_LEASE_DEAL',
  'REQUEST',
]);

const personalScheduleSchema = z.object({
  type: z.literal('PERSONAL'),
  date: z.string().datetime(),
  title: z.string().min(3),
  description: z.string().optional(),
});

const saleLeaseDealScheduleSchema = z.object({
  type: z.literal('SALE_LEASE_DEAL'),
  date: z.string().datetime(),
  title: z.string().min(3),
  description: z.string().optional(),
  saleLeaseDealId: z.string().uuid(),
});
const buyRentDealScheduleSchema = z.object({
  type: z.literal('BUY_RENT_DEAL'),
  date: z.string().datetime(),
  title: z.string().min(3),
  description: z.string().optional(),
  buyRentDealId: z.string().uuid(),
});

const requestScheduleSchema = z.object({
  type: z.literal('REQUEST'),
  date: z.string().datetime(),
  title: z.string().min(3),
  description: z.string().optional(),
  requestId: z.string().uuid(),
});

const createScheduleSchema = z.discriminatedUnion('type', [
  personalScheduleSchema,
  saleLeaseDealScheduleSchema,
  buyRentDealScheduleSchema,
  requestScheduleSchema,
]);

const scheduleIdSchema = z.object({
  id: z.string().uuid(),
});

const changeScheduleSchema = z.object({
  date: z.string().datetime(),
});

module.exports = {
  createScheduleSchema,
  scheduleIdSchema,
  changeScheduleSchema,
};
