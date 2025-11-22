const { prisma } = require("../config/database");
const axios = require('axios');

// Hugging Face Inference Providers config
const HF_API_KEY = process.env.HF_API_KEY;
const HF_PROVIDER = process.env.HF_PROVIDER || 'publicai';
const HF_MODEL = process.env.HF_MODEL || 'swiss-ai/Apertus-70B-Instruct-2509';

// Helper to ensure a default user exists
async function getDefaultUser() {
  let user = await prisma.user.findUnique({ where: { username: 'demo_user' } });
  if (!user) {
    user = await prisma.user.create({ data: { username: 'demo_user' } });
  }
  return user;
}

// POST /api/generate - Generate Code
async function generateCode(req, res) {
  const { prompt, language } = req.body;

  if (!prompt || !language) {
    return res.status(400).json({ error: "Prompt and language are required" });
  }

  if (!HF_API_KEY) {
    return res.status(500).json({ error: "HF_API_KEY is missing in .env" });
  }

  try {
    const systemContent = `
You are a coding assistant. Generate only raw code in ${language}.
- No markdown
- No explanations
- No comments
- No backticks
Return ONLY the code.
`.trim();

    const userContent = `Prompt: ${prompt}\n\nCode:\n`;

    const hfResponse = await axios.post(
      `https://router.huggingface.co/${HF_PROVIDER}/v1/chat/completions`,
      {
        model: HF_MODEL,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userContent }
        ],
        max_tokens: 800,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60000
      }
    );

    const choice = hfResponse.data?.choices?.[0];
    const generatedCode = (choice?.message?.content || "").trim();

    if (!generatedCode) {
      console.error("HF empty / unexpected response:", hfResponse.data);
      return res.status(500).json({ error: "Empty response from Hugging Face provider." });
    }

    // Save to DB
    const user = await getDefaultUser();
    const record = await prisma.generation.create({
      data: {
        prompt,
        language,
        code: generatedCode,
        userId: user.id
      }
    });

    res.json(record);
  } catch (error) {
    if (error.response) {
      console.error("HF Error:", {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.error("HF Error:", error.message || error);
    }

    res.status(500).json({
      error: "Failed to generate code",
      details: error.response?.data || error.message
    });
  }
}

// GET /api/history
async function getHistory(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const [generations, total] = await prisma.$transaction([
      prisma.generation.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: { user: true }
      }),
      prisma.generation.count()
    ]);

    res.json({
      data: generations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
}

module.exports = {
  generateCode,
  getHistory,
};