const dotenv = require('dotenv');
const prisma = require('./db');

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

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}...`);
});
