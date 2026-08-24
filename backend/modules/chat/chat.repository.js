const APIFeatures = require('../../utils/apiFeatures');

class ChatRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllChats(userId, queryString = {}) {
    queryString.select = 'id,createdAt,updatedAt';

    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.limitFields();
    features = features.paginate();

    features.options.where = {
      ...features.options.where,
      type: { in: ['INTERNAL_DIRECT', 'INTERNAL_GROUP'] },
      roomMembers: { some: { userId } },
    };

    return this.prisma.room.findMany(features.options);
  }

  findMyDealChats(userId) {
    return this.prisma.room.findMany({
      where: {
        type: 'DEAL',
        roomMembers: { some: { userId } },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        buyRentDeal: {
          select: {
            id: true,
            dealType: true,
            dealStatus: true,
            clientId: true,
            employeeId: true,
            property: {
              select: { id: true, type: true, city: true },
            },
          },
        },
        saleLeaseDeal: {
          select: {
            id: true,
            dealType: true,
            dealStatus: true,
            clientId: true,
            employeeId: true,
            property: {
              select: { id: true, type: true, city: true },
            },
          },
        },
        roomMembers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                employee: {
                  select: { name: true, fullName: true, photo: true },
                },
                client: { select: { name: true, photo: true } },
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            user: { select: { id: true, email: true, role: true } },
          },
        },
      },
    });
  }

  findChatById(id) {
    return this.prisma.room.findUnique({
      where: { id },
    });
  }

  isRoomMember(roomId, userId) {
    return this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
      select: { id: true },
    });
  }

  createChat(data) {
    const { members = [], ...roomData } = data;

    return this.prisma.room.create({
      data: {
        ...roomData,
        roomMembers: {
          create: members.map((userId) => ({ userId })),
        },
      },
    });
  }

  findChatMessages(roomId, queryString = {}) {
    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.limitFields();
    features = features.paginate();

    features.options.where = {
      ...features.options.where,
      roomId,
    };

    return this.prisma.message.findMany(features.options);
  }

  createMessage(data) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          message: data.message,
          room: { connect: { id: data.roomId } },
          user: { connect: { id: data.userId } },
        },
        include: { user: true },
      });

      await tx.room.update({
        where: { id: data.roomId },
        data: { lastMessageId: message.id },
      });

      return message;
    });
  }

  findMessageById(id) {
    return this.prisma.message.findUnique({
      where: { id },
      select: { id: true, roomId: true, userId: true, isDeleted: true },
    });
  }

  updateMessage(id, message) {
    return this.prisma.message.update({
      where: { id },
      data: { message, isEdited: true },
      include: { user: true },
    });
  }

  async deleteMessage(id, roomId) {
    return this.prisma.$transaction(async (tx) => {
      const deletedMessage = await tx.message.update({
        where: { id },
        data: { isDeleted: true, message: null },
        include: { user: true },
      });

      const room = await tx.room.findUnique({
        where: { id: roomId },
        select: { lastMessageId: true },
      });

      if (room && room.lastMessageId === id) {
        const latestMessage = await tx.message.findFirst({
          where: { roomId, isDeleted: false },
          orderBy: { createdAt: 'desc' },
          select: { id: true },
        });

        await tx.room.update({
          where: { id: roomId },
          data: { lastMessageId: latestMessage ? latestMessage.id : null },
        });
      }

      return deletedMessage;
    });
  }

  markRoomAsRead(roomId, userId, messageId) {
    return this.prisma.roomMember.update({
      where: { roomId_userId: { roomId, userId } },
      data: { lastReadMessageId: messageId },
    });
  }

  upsertPresence(userId, status) {
    return this.prisma.presence.upsert({
      where: { userId },
      create: {
        userId,
        status,
        lastSeen: status === 'OFFLINE' ? new Date() : null,
      },
      update: {
        status,
        lastSeen: status === 'OFFLINE' ? new Date() : null,
      },
    });
  }
}

module.exports = ChatRepository;
