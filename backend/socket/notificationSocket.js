function notificationSocket(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('identify', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User joined room user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}

module.exports = notificationSocket;
