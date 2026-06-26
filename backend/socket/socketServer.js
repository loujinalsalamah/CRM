// socket/socketServer.js

const { Server } = require('socket.io');

function createSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  return io;
}

module.exports = createSocketServer;
