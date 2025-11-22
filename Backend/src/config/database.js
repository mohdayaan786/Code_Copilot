// database.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL Database");
  } 
  catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

module.exports = { prisma, connectDB };