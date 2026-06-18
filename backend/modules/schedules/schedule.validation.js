const { z } = require('zod');

// eslint-disable-next-line no-unused-vars
const ScheduleTypeEnum = z.enum(['PERSONAL', 'DEAL', 'REQUEST']);

const personalScheduleSchema = z.object({
  type: z.literal('PERSONAL'),
  date: z.string().datetime(),
  title: z.string().min(3),
  description: z.string().optional(),
});

const dealScheduleSchema = z.object({
  type: z.literal('DEAL'),
  date: z.string().datetime(),
  title: z.string().min(3),
  description: z.string().optional(),
  dealId: z.string().uuid(),
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
  dealScheduleSchema,
  requestScheduleSchema,
]);

const scheduleIdSchema = z.object({
  id: z.string().uuid(),
});

const updateScheduleSchema = z.object({
  date: z.string().datetime().optional(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
});

const cancelScheduleSchema = z.object({
  cancelReason: z.string().optional(),
});

const completeScheduleSchema = z.object({
  completeNote: z.string().optional(),
});

module.exports = {
  createScheduleSchema,
  scheduleIdSchema,
  updateScheduleSchema,
  cancelScheduleSchema,
  completeScheduleSchema,
};
