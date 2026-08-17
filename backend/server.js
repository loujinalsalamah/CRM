const http = require('http');
const dotenv = require('dotenv');
const prisma = require('./db');
const createSocketServer = require('./socket/socketServer');
const notificationSocket = require('./socket/notificationSocket');
const { setIo } = require('./socket/io');

dotenv.config({ path: './config.env' });

const AIService = require('./modules/ai/ai.service');
const aiService = new AIService();

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

const server = http.createServer(app);

const io = createSocketServer(server);

setIo(io);

notificationSocket(io);

server.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}...`);
});

// async function runAIRecommendation() {
//   try {
//     const data = await aiService.recommendBestEmployees(5);
//     console.log('Result:', data);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// runAIRecommendation();

// async function runAISegmentation() {
//   try {
//     const data = await aiService.segmentLead(1);
//     console.log('Segmentation Result:', data);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// runAISegmentation();

// async function runAISalesForecast() {
//   try {
//     const data = await aiService.forecastSales(6);
//     console.log('Sales Forecast Result:', data);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// runAISalesForecast();

// async function runAIUserStage() {
//   try {
//     const data = await aiService.getUserStage(7);
//     console.log('User Stage Result:', data);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// runAIUserStage();

// async function runAIRecommendProperties() {
//   try {
//     const data = await aiService.recommendProperties(7, 'lead', 5);
//     console.log('Property Recommendations Result:', data);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// runAIRecommendProperties();
