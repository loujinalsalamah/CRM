const http = require('http');
const dotenv = require('dotenv');
const prisma = require('./db');
const createSocketServer = require('./socket/socketServer');
const notificationSocket = require('./socket/notificationSocket');
const { setIo } = require('./socket/io');

dotenv.config({ path: './config.env' });

const app = require('./app');

async function connection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

connection();

const port = process.env.PORT || 3000;

// create HTTP server from Express app
const server = http.createServer(app);

// create socket.io server bound to the HTTP server
const io = createSocketServer(server);

// store io in shared helper so other modules can call getIo()
setIo(io);

// initialize socket handlers (join rooms, etc.)
notificationSocket(io);

server.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}...`);
});
