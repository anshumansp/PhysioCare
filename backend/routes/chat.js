const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const fetch = require('node-fetch');

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

const generateSystemPrompt = (userMessage) => {
  return `You are a knowledgeable physiotherapy assistant. Help users understand their symptoms and provide general guidance.
Current user message: ${userMessage}

Remember:
1. Be professional and empathetic
2. Provide general guidance only
3. Recommend scheduling an appointment for proper diagnosis
4. Focus on physiotherapy-related topics
5. Don't make definitive diagnoses

User message: ${userMessage}`;
};

// Send message to chat assistant
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const systemPrompt = generateSystemPrompt(message);

    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: systemPrompt,
        options: {
          wait_for_model: true,
          max_length: 500
        }
      }),
    });

    const result = await response.json();
    let aiResponse = result[0]?.generated_text || "I apologize, but I'm having trouble processing your request. Please try again or consider scheduling an appointment for personalized assistance.";

    // Post-process the response to ensure it's physiotherapy-focused
    if (!aiResponse.toLowerCase().includes('physio') && !aiResponse.toLowerCase().includes('appointment')) {
      aiResponse += "\n\nFor a more detailed assessment of your condition, I recommend scheduling an appointment with our physiotherapist.";
    }

    // Save the chat message with a session ID instead of user ID
    const sessionId = req.headers['x-session-id'] || Date.now().toString();
    const chatMessage = new ChatMessage({
      sessionId,
      message,
      response: aiResponse
    });
    await chatMessage.save();

    res.json({
      message: aiResponse,
      shouldSchedule: aiResponse.toLowerCase().includes('schedule') || 
                     aiResponse.toLowerCase().includes('appointment'),
      sessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Error processing your request',
      message: "I apologize, but I'm having trouble processing your request. Please try again or consider scheduling an appointment for personalized assistance."
    });
  }
});

// Get chat history
router.get('/history', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
      return res.json([]);
    }
    
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
