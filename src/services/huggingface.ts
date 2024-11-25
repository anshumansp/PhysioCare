import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

const SYSTEM_PROMPT = `You are Dr. AI, a professional physiotherapist conducting a patient consultation. Your role is to understand the patient's condition through careful questioning and provide appropriate guidance.

IMPORTANT RULES:
1. NEVER generate responses on behalf of the patient
2. NEVER continue the conversation by yourself
3. WAIT for the patient's actual responses
4. Ask only ONE question at a time
5. Keep your responses under 2 sentences

CONSULTATION APPROACH:
1. Start with a warm, professional greeting
2. Listen carefully to the patient's complaint
3. Ask focused follow-up questions about:
   - Exact location and nature of pain/discomfort
   - Duration and progression
   - Pain intensity (1-10 scale)
   - Aggravating factors
   - Impact on daily activities
   - Previous treatments tried

RESPONSE STYLE:
- Be empathetic but professional
- Acknowledge patient's responses before asking next question
- Use simple, clear language
- Show you're actively listening by referencing previous information

DECISION MAKING:
- Only after gathering sufficient information:
  * For concerning symptoms: Express understanding, explain your recommendation, add "[SCHEDULE_APPOINTMENT]"
  * For minor issues: Provide specific self-care guidance

Current conversation context:
{context}

Remember: You are conducting a real medical consultation. Wait for the patient's response after each question.`;

interface ConversationState {
  context: string;
  phase: 'greeting' | 'initial_assessment' | 'detailed_assessment' | 'conclusion';
  questionsAsked: string[];
  keyInformation: {
    mainComplaint?: string;
    location?: string;
    duration?: string;
    intensity?: string;
    triggers?: string;
    impact?: string;
    treatments?: string;
  };
}

let conversationState: ConversationState = {
  context: '',
  phase: 'greeting',
  questionsAsked: [],
  keyInformation: {}
};

const cleanResponse = (text: string): string => {
  return text
    // Remove any conversation markers
    .replace(/^(Human|User|Assistant|Patient|Doctor|Dr\. AI):?\s*/gim, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/\n\s*(Human|User|Assistant|Patient|Doctor|Dr\. AI):?.*/gs, '')
    // Remove any self-generated patient responses
    .replace(/Patient:.*?\n/g, '')
    // Remove numbered lists
    .replace(/^\d+[\)\.]\s+/gm, '')
    // Clean up multiple newlines and spaces
    .replace(/\n{2,}/g, '\n')
    .replace(/\s{2,}/g, ' ')
    // Clean up any remaining artifacts
    .replace(/^[^a-zA-Z]*/, '')
    .trim();
};

const updateConversationState = (message: string, isUser: boolean) => {
  // Update context with the new message
  const prefix = isUser ? 'Patient' : 'Dr. AI';
  conversationState.context += `\n${prefix}: ${message}\n`;

  if (isUser) {
    // Extract and update key information based on the message
    const lowerMessage = message.toLowerCase();
    
    // Update main complaint if this is one of the first messages
    if (conversationState.questionsAsked.length <= 1) {
      conversationState.keyInformation.mainComplaint = message;
    }
    
    // Update pain location
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurts') || lowerMessage.includes('ache')) {
      const locationWords = message.match(/(?:in|on|my)\s+(\w+(?:\s+\w+)?)\s+(?:hurts|pain|aches)/i);
      if (locationWords) {
        conversationState.keyInformation.location = locationWords[1];
      }
    }

    // Update duration
    if (lowerMessage.includes('day') || lowerMessage.includes('week') || lowerMessage.includes('month') || lowerMessage.includes('year')) {
      conversationState.keyInformation.duration = message;
    }

    // Update intensity
    if (lowerMessage.includes('scale') || /\d+\/10/.test(lowerMessage) || lowerMessage.includes('intensity')) {
      conversationState.keyInformation.intensity = message;
    }

    // Update triggers
    if (lowerMessage.includes('when') || lowerMessage.includes('after') || lowerMessage.includes('worse')) {
      conversationState.keyInformation.triggers = message;
    }

    // Update phase based on information gathered
    if (conversationState.phase === 'greeting' && message.length > 0) {
      conversationState.phase = 'initial_assessment';
    } else if (
      conversationState.phase === 'initial_assessment' && 
      conversationState.keyInformation.location && 
      conversationState.keyInformation.duration
    ) {
      conversationState.phase = 'detailed_assessment';
    } else if (
      conversationState.phase === 'detailed_assessment' &&
      conversationState.keyInformation.intensity &&
      conversationState.keyInformation.triggers &&
      conversationState.questionsAsked.length >= 4
    ) {
      conversationState.phase = 'conclusion';
    }
  }
};

export const resetContext = () => {
  conversationState = {
    context: '',
    phase: 'greeting',
    questionsAsked: [],
    keyInformation: {}
  };
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const generateResponse = async (message: string) => {
  try {
    updateConversationState(message, true);

    const response = await sendMessage(message);

    let assistantResponse = response || '';
    assistantResponse = cleanResponse(assistantResponse);

    if (!assistantResponse) {
      return "I apologize, but I couldn't generate a proper response. Could you please repeat your last message?";
    }

    // Add [SCHEDULE_APPOINTMENT] if in conclusion phase and symptoms seem serious
    if (
      conversationState.phase === 'conclusion' && 
      (conversationState.keyInformation.intensity?.includes('7') || 
       conversationState.keyInformation.intensity?.includes('8') ||
       conversationState.keyInformation.intensity?.includes('9') ||
       conversationState.keyInformation.intensity?.includes('10') ||
       conversationState.keyInformation.duration?.includes('week') ||
       conversationState.keyInformation.duration?.includes('month'))
    ) {
      assistantResponse += ' [SCHEDULE_APPOINTMENT]';
    }

    updateConversationState(assistantResponse, false);
    conversationState.questionsAsked.push(assistantResponse);

    return assistantResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};
