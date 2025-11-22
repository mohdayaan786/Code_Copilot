require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');  
const generationRoutes = require('./routes/route');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();  // ⬅ CALL FUNCTION

// Routes
app.use('/api', generationRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Code Copilot API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});