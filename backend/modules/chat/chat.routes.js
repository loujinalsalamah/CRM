const express = require('express');

const prisma = require('../../db');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

// استدعاء المكونات الأساسية للشات (الهياكل فقط)
const ChatController = require('./chat.controller');
const ChatService = require('./chat.service');
const ChatRepository = require('./chat.repository');

// استدعاءSchemas التحقق من المدخلات (متروكة فارغة لتقوم بتعبئتها)
const {
  createRoomSchema,
  roomIdSchema,
  messageIdSchema,
  sendMessageSchema,
  editMessageSchema,
  readMessageSchema,
} = require('./chat.validation');

// حقن الاعتماديات وبناء الـ Instances
const chatRepository = new ChatRepository(prisma);
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);

const router = express.Router();

// 1. جلب جميع المحادثات الخاصة بالمستخدم الحالي
router.get(
  '/',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  catchAsync(chatController.getAllChats),
);

router.get(
  '/myDeals',
  catchAsync(protect),
  restrictTo('EMPLOYEE', 'CLIENT'),
  catchAsync(chatController.getMyDealChats),
);

// 2. إنشاء محادثة جديدة (مثلاً بين مستخدم وكونسلتانت أو غرف شات)
router.post(
  '/',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ body: createRoomSchema }),
  catchAsync(chatController.createChat),
);

// 3. جلب رسائل محادثة معينة بواسطة الـ ID
router.get(
  '/:id/messages',
  catchAsync(protect),
  restrictTo('EMPLOYEE', 'CLIENT'),
  validate({ params: roomIdSchema }),
  catchAsync(chatController.getChatMessages),
);

// 4. إرسال رسالة جديدة داخل محادثة
router.post(
  '/:id/messages',
  catchAsync(protect),
  restrictTo('EMPLOYEE', 'CLIENT'),
  validate({ params: roomIdSchema, body: sendMessageSchema }),
  catchAsync(chatController.sendMessage),
);

router.patch(
  '/messages/:messageId',
  catchAsync(protect),
  restrictTo('EMPLOYEE', 'CLIENT'),
  validate({ params: messageIdSchema, body: editMessageSchema }),
  catchAsync(chatController.updateMessage),
);

router.delete(
  '/messages/:messageId',
  catchAsync(protect),
  restrictTo('EMPLOYEE', 'CLIENT'),
  validate({ params: messageIdSchema }),
  catchAsync(chatController.deleteMessage),
);

router.patch(
  '/:id/read',
  catchAsync(protect),
  restrictTo('EMPLOYEE', 'CLIENT'),
  validate({ params: roomIdSchema, body: readMessageSchema }),
  catchAsync(chatController.markRoomAsRead),
);

module.exports = router;
