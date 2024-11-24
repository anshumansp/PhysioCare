import axios from 'axios';

const API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

const huggingfaceApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

const SYSTEM_PROMPT = `You are PhysioAI, a helpful AI assistant specializing in physiotherapy and physical health. Keep responses concise (2-3 sentences max). Instead of suggesting to consult healthcare professionals, end your response with "[SCHEDULE_APPOINTMENT]" if the query indicates the user might benefit from professional consultation. Focus on practical, direct advice.`;

export const generateResponse = async (message: string) => {
  try {
    const response = await huggingfaceApi.post('', {
      inputs: `${SYSTEM_PROMPT}\n\nHuman: ${message}\nAssistant: `,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false
      }
    });

    let assistantResponse = response.data[0].generated_text || '';
    
    // Clean up the response
    assistantResponse = assistantResponse
      .replace(/^(Human|User|Assistant):?\s*/gim, '')
      .replace(/<\|.*?\|>/g, '')
      .replace(/\n\s*(Human|User|Assistant):?.*/gs, '')
      .trim();

    if (!assistantResponse) {
      return "I apologize, but I couldn't generate a proper response. Please try asking your question again.";
    }

    return assistantResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};
