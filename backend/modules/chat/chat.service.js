const AppError = require('../../utils/appError');
const { getIo } = require('../../socket/io');

class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async getAllChats(userId) {
    const chats = await this.chatRepository.findAllChats(userId);
    return chats;
  }

  async getMyDealChats(userId) {
    return this.chatRepository.findMyDealChats(userId);
  }

  // 2. إنشاء محادثة جديدة
  async createChat(data, ownerId) {
    const members = [...new Set([...(data.members || []), ownerId])];
    const newChat = await this.chatRepository.createChat({
      ...data,
      ownerId,
      members,
    });
    return newChat;
  }

  // 3. جلب رسائل محادثة معينة بواسطة الـ ID
  async getChatMessages(roomId, userId) {
    const chat = await this.chatRepository.findChatById(roomId);
    if (!chat) {
      throw new AppError('No chat found with that id', 404);
    }
    if (userId && !(await this.chatRepository.isRoomMember(roomId, userId))) {
      throw new AppError('You are not a member of this room', 403);
    }

    const messages = await this.chatRepository.findChatMessages(roomId);
    return messages;
  }

  async sendMessage(roomId, userId, data) {
    const chat = await this.chatRepository.findChatById(roomId);
    if (!chat) {
      throw new AppError('No chat found with that id', 404);
    }
    if (!(await this.chatRepository.isRoomMember(roomId, userId))) {
      throw new AppError('You are not a member of this room', 403);
    }

    const messageData = {
      message: data.message,
      roomId,
      userId,
    };

    const message = await this.chatRepository.createMessage(messageData);
    const io = getIo();
    io.of('/chat')
      .to(ChatService.roomName(roomId))
      .emit('messageCreated', message);
    return message;
  }

  async updateMessage(messageId, userId, message) {
    const existingMessage =
      await this.chatRepository.findMessageById(messageId);
    this.assertMessageOwner(existingMessage, userId);

    const updatedMessage = await this.chatRepository.updateMessage(
      messageId,
      message,
    );
    getIo()
      .of('/chat')
      .to(ChatService.roomName(existingMessage.roomId))
      .emit('messageUpdated', updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(messageId, userId) {
    const existingMessage =
      await this.chatRepository.findMessageById(messageId);
    this.assertMessageOwner(existingMessage, userId);

    const deletedMessage = await this.chatRepository.deleteMessage(
      messageId,
      existingMessage.roomId,
    );
    getIo()
      .of('/chat')
      .to(ChatService.roomName(existingMessage.roomId))
      .emit('messageDeleted', deletedMessage);
    return deletedMessage;
  }

  async markRoomAsRead(roomId, userId, messageId) {
    await this.getChatMessages(roomId, userId);
    const message = await this.chatRepository.findMessageById(messageId);
    if (!message || message.roomId !== roomId) {
      throw new AppError('Message not found in this room', 404);
    }

    const member = await this.chatRepository.markRoomAsRead(
      roomId,
      userId,
      messageId,
    );
    getIo()
      .of('/chat')
      .to(ChatService.roomName(roomId))
      .emit('messageRead', { roomId, userId, messageId });
    return member;
  }

  async updatePresence(userId, status) {
    const presence = await this.chatRepository.upsertPresence(userId, status);
    getIo().of('/chat').emit('presenceUpdated', presence);
    return presence;
  }

  assertMessageOwner(message, userId) {
    if (!message) throw new AppError('Message not found', 404);
    if (message.userId !== userId) {
      throw new AppError('You can only change your own messages', 403);
    }
    if (message.isDeleted) {
      throw new AppError('Deleted messages cannot be changed', 400);
    }
  }

  static roomName(roomId) {
    return `chat_room_${roomId}`;
  }
}

module.exports = ChatService;
