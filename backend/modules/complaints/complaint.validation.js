const { z } = require('zod');

const createComplaintSchema = z.object({
  issueMessage: z.string().min(1, 'Issue message is required'),
  complaintTypeId: z.string().uuid('Complaint type is required'),
});

const complaintIdSchema = z.object({
  id: z.string().uuid('Complaint ID must be a valid UUID'),
});

module.exports = {
  createComplaintSchema,
  complaintIdSchema,
  // replyComplaintSchema,
};
