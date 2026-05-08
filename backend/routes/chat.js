import express from 'express';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Rate limiting: 20 messages per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many messages sent from this IP, please try again after 15 minutes.' }
});

// Initialize OpenAI SDK
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// The strict persona for the tax assistant
const SYSTEM_PROMPT = `You are ARia, the official AI Tax Assistant for A.R. Wealth & Tax Co., an expert tax advisory firm based in India.
Your role is to help users with basic Indian tax queries.

CRITICAL RULES:
1. Always be extremely polite, empathetic, and professional. 
2. Give the necessary factual tax information the user is seeking (e.g., ITR dates, Section 80C limits, general slab info) so they get immediate value.
3. AT THE END OF EVERY RESPONSE, subtly and politely recommend that they seek professional help from our expert CAs to ensure their taxes are handled perfectly and optimally. Encourage them to visit the "Contact Us" or "Pricing" page to connect with a human expert.
4. Keep responses concise and easy to read (under 4 short paragraphs).
5. NEVER give highly specific financial advice tailored to a user's unique exact numbers without a strong disclaimer.
6. Refuse to answer questions unrelated to taxation, finance, or A.R. Wealth & Tax Co.
7. Format your responses using basic markdown (bolding, bullet points).`;

router.post('/', chatLimiter, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: 'Chat service is currently unavailable. (API key not configured)' 
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message format.' });
    }

    // Format messages for OpenAI API
    // The frontend sends { role: 'user' | 'model', content: string }
    // OpenAI expects { role: 'user' | 'assistant', content: string }
    const formattedHistory = messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, cheap, and very capable
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...formattedHistory
      ],
      temperature: 0.3, // Low temperature for more factual, consistent tax answers
    });

    if (response.choices && response.choices.length > 0) {
      res.json({ reply: response.choices[0].message.content });
    } else {
      throw new Error('No text returned from OpenAI API');
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Sorry, I am having trouble connecting right now. Please try again later.' });
  }
});

export default router;
