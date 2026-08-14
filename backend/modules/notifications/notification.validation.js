const { z } = require('zod');

const createNotification = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.string().uuid().optional(),
  entityType: z.literal('SCHEDULE').optional(),
  entityId: z.string().uuid().optional(),
  data: z
    .object({
      action: z.string(),
      importance: z.enum(['low', 'medium', 'high']),
    })
    .optional(),
});

const notificationIdSchema = z.object({
  id: z.string().uuid(),
});

module.exports = {
  createNotification,
  notificationIdSchema,
};
