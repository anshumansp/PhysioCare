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

export const generateResponse = async (message: string) => {
  try {
    const response = await huggingfaceApi.post('', {
      inputs: `<|system|>You are PhysioAI, a helpful AI assistant specializing in physiotherapy and physical health. Provide accurate, helpful, and concise responses.

${message}`,
    });
    return response.data[0].generated_text;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
