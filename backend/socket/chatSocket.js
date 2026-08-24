const jwt = require('jsonwebtoken');
const prisma = require('../db');
const ChatRepository = require('../modules/chat/chat.repository');
const ChatService = require('../modules/chat/chat.service');

const chatService = new ChatService(new ChatRepository(prisma));

function chatSocket(io) {
  const chatNamespace = io.of('/chat');

  chatNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error('Invalid authentication token'));
    }
  });

  chatNamespace.on('connection', (socket) => {
    console.log('Chat socket connected:', socket.id);
    chatService.updatePresence(socket.user.id, 'ONLINE').catch(() => {});

    socket.on('joinRoom', async (roomId, callback = () => {}) => {
      try {
        await chatService.getChatMessages(roomId, socket.user.id);
        socket.join(ChatService.roomName(roomId));
        callback({ status: 'success', roomId });
      } catch (error) {
        callback({ status: 'error', message: error.message });
      }
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(ChatService.roomName(roomId));
    });

    socket.on('sendMessage', async (data, callback = () => {}) => {
      try {
        const createdMessage = await chatService.sendMessage(
          data.roomId,
          socket.user.id,
          data,
        );
        callback({ status: 'success', data: createdMessage });
      } catch (error) {
        callback({ status: 'error', message: error.message });
      }
    });

    socket.on('editMessage', async (data, callback = () => {}) => {
      try {
        const message = await chatService.updateMessage(
          data.messageId,
          socket.user.id,
          data.message,
        );
        callback({ status: 'success', data: message });
      } catch (error) {
        callback({ status: 'error', message: error.message });
      }
    });

    socket.on('deleteMessage', async (messageId, callback = () => {}) => {
      try {
        const message = await chatService.deleteMessage(
          messageId,
          socket.user.id,
        );
        callback({ status: 'success', data: message });
      } catch (error) {
        callback({ status: 'error', message: error.message });
      }
    });

    socket.on('markAsRead', async (data, callback = () => {}) => {
      try {
        await chatService.markRoomAsRead(
          data.roomId,
          socket.user.id,
          data.messageId,
        );
        callback({ status: 'success' });
      } catch (error) {
        callback({ status: 'error', message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Chat socket disconnected:', socket.id);
      chatService.updatePresence(socket.user.id, 'OFFLINE').catch(() => {});
    });
  });
}

module.exports = chatSocket;
