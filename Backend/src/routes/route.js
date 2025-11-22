const express = require('express');
const router = express.Router();
const { generateCode, getHistory,} = require('../controllers/generations'); 

// POST /api/generate
router.post('/generate', generateCode);

// GET /api/history
router.get('/history', getHistory);

module.exports = router;