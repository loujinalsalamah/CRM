const { z } = require('zod');

// تعريف الـ Enums بناءً على الـ Prisma Schema الخاصة بك
const RoomCategory = z.enum(['DEAL', 'INTERNAL_DIRECT', 'INTERNAL_GROUP']);
const PresenceStatus = z.enum(['ONLINE', 'OFFLINE']);

// 1. التحقق من معرف الغرفة (UUID) في الـ Params
const roomIdSchema = z.object({
  id: z.string().uuid(),
});

const messageIdSchema = z.object({
  messageId: z.string().uuid(),
});

// 2. التحقق من بيانات إنشاء غرفة جديدة (Room)
const createRoomSchema = z.object({
  name: z.string().min(1).max(100).nullable().optional(),
  image: z.string().url().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  type: RoomCategory,
  ownerId: z.string().uuid().nullable().optional(),
  // مصفوفة تحتوي على معرفات الأعضاء المطلوب إضافتهم للغرفة عند الإنشاء
  members: z.array(z.string().uuid()).min(1).optional(),
});

// 3. التحقق من بيانات إرسال رسالة جديدة (Message)
const sendMessageSchema = z.object({
  message: z.string().min(1),
});

const editMessageSchema = z.object({
  message: z.string().min(1),
});

const readMessageSchema = z.object({
  messageId: z.string().uuid(),
});

// 4. التحقق من بيانات تحديث حالة التواجد (Presence)
const updatePresenceSchema = z.object({
  status: PresenceStatus,
});

module.exports = {
  roomIdSchema,
  messageIdSchema,
  createRoomSchema,
  sendMessageSchema,
  editMessageSchema,
  readMessageSchema,
  updatePresenceSchema,
};
