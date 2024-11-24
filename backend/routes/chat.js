const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

let conversationHistory = '';

// Validate if response is meaningful
const isValidResponse = (text) => {
  if (!text) return false;
  
  // Check for gibberish or random characters
  const gibberishPattern = /^[^a-zA-Z]*$|^[\d\s\W]+$/;
  if (gibberishPattern.test(text)) return false;
  
  // Check for common error patterns
  const errorPatterns = [
    'pil', 'error', 'couldn\'t generate', 
    'apologize', 'invalid', 'failed'
  ];
  
  return !errorPatterns.some(pattern => 
    text.toLowerCase().includes(pattern)
  );
};

// Get appropriate response based on conversation phase
const getFallbackResponse = () => {
  const history = conversationHistory.toLowerCase();
  
  // Initial phase
  if (!history || history.split('\n').length <= 2) {
    return "Could you please tell me where exactly in your back you're experiencing pain? Is it upper, middle, or lower back?";
  }
  
  // Have location but no duration
  if (!history.includes('week') && !history.includes('month') && !history.includes('day')) {
    return "How long have you been experiencing this back pain? Also, is it a sharp, dull, or throbbing pain?";
  }
  
  // Have duration but no intensity
  if (!history.includes('scale') && !history.includes('/10')) {
    return "On a scale of 1-10, how severe is your pain? What activities tend to make it worse?";
  }
  
  // Have intensity but no treatment info
  if (!history.includes('tried') && !history.includes('treatment')) {
    return "Have you tried any treatments or medications for this pain? What helps relieve it?";
  }
  
  return "Would you like to tell me more about how this affects your daily activities?";
};

const generateSystemPrompt = (userMessage) => {
  // Update conversation history with user message
  conversationHistory += `\nPatient: ${userMessage}\n`;

  return `You are Dr. AI, a professional physiotherapist conducting a medical consultation. Be concise and clear.

RULES:
1. Responses must be 2-3 short sentences maximum
2. Ask 1-2 focused questions at a time
3. Always acknowledge what the patient just told you
4. Use simple, clear medical language

CONSULTATION STEPS:
1. Pain Details:
   - Exact location (upper/middle/lower, left/right)
   - Type (sharp/dull/throbbing)
   - Duration

2. Assessment:
   - Pain intensity (1-10)
   - Triggering factors
   - Relief methods

3. Recommendations:
   - For severe pain (>7/10) or chronic (>2 weeks): [SCHEDULE_APPOINTMENT]
   - For mild cases: Basic self-care advice

CONVERSATION HISTORY:
${conversationHistory}

Remember: Keep responses professional, brief, and focused on gathering necessary medical information.`;
};

router.post('/', async (req, res) => {
  try {
    const { message, resetContext } = req.body;
    
    if (resetContext) {
      conversationHistory = '';
    }

    const systemPrompt = generateSystemPrompt(message);

    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 60,
          temperature: 0.5,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
          repetition_penalty: 1.2,
          stop: ["Patient:", "Human:", "\n\n"]
        }
      }),
    });

    if (!response.ok) {
      const fallback = getFallbackResponse();
      conversationHistory += `Dr. AI: ${fallback}\n`;
      return res.json({ message: fallback });
    }

    const result = await response.json();
    let aiResponse = result[0]?.generated_text;

    // Validate and clean response
    if (!aiResponse || !isValidResponse(aiResponse)) {
      const fallback = getFallbackResponse();
      conversationHistory += `Dr. AI: ${fallback}\n`;
      return res.json({ message: fallback });
    }

    // Clean up response
    aiResponse = aiResponse
      .replace(/^(Dr\. AI:|Assistant:)/i, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Add appointment tag if needed
    if (
      conversationHistory.toLowerCase().includes('pain is 8') ||
      conversationHistory.toLowerCase().includes('pain is 9') ||
      conversationHistory.toLowerCase().includes('pain is 10') ||
      (conversationHistory.toLowerCase().includes('month') && 
       conversationHistory.toLowerCase().includes('pain'))
    ) {
      aiResponse += ' [SCHEDULE_APPOINTMENT]';
    }

    // Update conversation history
    conversationHistory += `Dr. AI: ${aiResponse}\n`;

    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    const fallback = getFallbackResponse();
    conversationHistory += `Dr. AI: ${fallback}\n`;
    res.json({ message: fallback });
  }
});

module.exports = router;
