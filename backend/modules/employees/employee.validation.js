const { z } = require('zod');

const EmployeeRoleEnum = z.enum([
  'SALES',
  'PURCHASING',
  'RENTAL',
  'SUPPORT',
  'CONSULTANT',
  'SALES_MANAGER',
  'GENERAL_MANAGER',
  'SUPPORT',
]);

const createEmployeeSchema = z.object({
  name: z.string().min(4).max(20),
  role: EmployeeRoleEnum,
  fullName: z.string().min(5).max(50),
  location: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  photo: z.string().url().optional(),
  salary: z.number().positive(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const employeeIdSchema = z
  .object({
    id: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
  })
  .refine((data) => data.id || data.employeeId, {
    message: 'Either id or employeeId must be provided',
    path: ['id'],
  });

module.exports = {
  createEmployeeSchema,
  employeeIdSchema,
};
