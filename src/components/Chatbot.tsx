import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/axiosConfig';
import useStore from '../store/useStore';

interface Message {
  message: string;
  response: string;
  createdAt: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setShowAppointmentModal, showChat, setShowChat } = useStore();

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const sessionId = localStorage.getItem('chatSessionId');
        if (!sessionId) {
          return;
        }
        
        const response = await api.get('/chat/history', {
          headers: {
            'x-session-id': sessionId
          }
        });
        setMessages(response.data.reverse());
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newUserMessage = { message, response: '', createdAt: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let sessionId = localStorage.getItem('chatSessionId');
      if (!sessionId) {
        sessionId = Date.now().toString();
        localStorage.setItem('chatSessionId', sessionId);
      }

      const response = await api.post('/chat', 
        { message },
        { 
          headers: {
            'x-session-id': sessionId
          }
        }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...newUserMessage, response: response.data.message }
      ]);

      if (response.data.shouldSchedule) {
        setShowAppointmentModal(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { 
          ...newUserMessage, 
          response: 'Sorry, I encountered an error. Please try again.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showChat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col"
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">PhysioAI Assistant</h2>
        <button
          onClick={() => setShowChat(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  index % 2 === 0
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{index % 2 === 0 ? message.message : message.response}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Chatbot;