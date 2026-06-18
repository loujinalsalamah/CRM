const { z } = require('zod');

const EmployeeTypeEnum = z.enum([
  'SALES',
  'PURCHASING',
  'RENTAL',
  'CONSULTANT',
  'SALES_MANAGER',
  'GENERAL_MANAGER',
]);

const createEmployeeSchema = z.object({
  name: z.string().min(4).max(20),
  type: EmployeeTypeEnum,
  fullName: z.string().min(5).max(50),
  location: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  photo: z.string().url().optional(),
  salary: z.number().positive(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

module.exports = {
  createEmployeeSchema,
};
