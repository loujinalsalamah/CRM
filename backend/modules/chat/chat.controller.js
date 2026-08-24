const AppError = require('../../utils/appError');

class ChatController {
  constructor(chatService) {
    this.chatService = chatService;

    this.getAllChats = this.getAllChats.bind(this);
    this.getMyDealChats = this.getMyDealChats.bind(this);
    this.createChat = this.createChat.bind(this);
    this.getChatMessages = this.getChatMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.markRoomAsRead = this.markRoomAsRead.bind(this);
  }

  async getAllChats(req, res, next) {
    const userId = req.user.id;
    const chats = await this.chatService.getAllChats(userId);

    res.status(200).json({
      status: 'success',
      results: chats.length,
      data: chats,
    });
  }

  async getMyDealChats(req, res, next) {
    const chats = await this.chatService.getMyDealChats(req.user.id);

    res.status(200).json({
      status: 'success',
      results: chats.length,
      data: chats,
    });
  }

  async createChat(req, res, next) {
    const data = req.body;
    const ownerId = req.user.id;
    const chat = await this.chatService.createChat(data, ownerId);

    if (!chat) {
      return next(new AppError('Failed to create chat', 400));
    }

    res.status(201).json({
      status: 'success',
      data: chat,
    });
  }

  async getChatMessages(req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;
    const messages = await this.chatService.getChatMessages(id, userId);

    if (!messages) {
      return next(new AppError('No chat found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: messages,
    });
  }

  async sendMessage(req, res, next) {
    const { id } = req.params;
    const data = req.body;
    const senderId = req.user.id;

    const message = await this.chatService.sendMessage(id, senderId, data);

    if (!message) {
      return next(new AppError('Failed to send message', 400));
    }

    res.status(201).json({
      status: 'success',
      data: message,
    });
  }

  async updateMessage(req, res, next) {
    const message = await this.chatService.updateMessage(
      req.params.messageId,
      req.user.id,
      req.body.message,
    );

    res.status(200).json({ status: 'success', data: message });
  }

  async deleteMessage(req, res, next) {
    const message = await this.chatService.deleteMessage(
      req.params.messageId,
      req.user.id,
    );

    res.status(200).json({ status: 'success', data: message });
  }

  async markRoomAsRead(req, res, next) {
    const member = await this.chatService.markRoomAsRead(
      req.params.id,
      req.user.id,
      req.body.messageId,
    );

    res.status(200).json({ status: 'success', data: member });
  }
}

module.exports = ChatController;
