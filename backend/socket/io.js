let ioInstance = null;

function setIo(io) {
  ioInstance = io;
}

function getIo() {
  if (!ioInstance) {
    throw new Error(
      'Socket.io not initialized. Call setIo(io) from server.js after creating io.',
    );
  }
  return ioInstance;
}

module.exports = { setIo, getIo };
