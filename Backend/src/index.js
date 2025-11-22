require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const generationRoutes = require('./routes/route');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Check
async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL Database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
main();

// Routes
app.use('/api', generationRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Code Copilot API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});