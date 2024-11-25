import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: import.meta.env.VITE_API_TIMEOUT || 60000
});

export default instance;
