import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, ChatMessage } from '../services/huggingface';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useChatStore } from '../store/useChatStore';
import { Send, Calendar, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { setShowAppointmentModal } = useStore();
  const { messages, addMessage, isChatOpen, closeChat } = useChatStore();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage({ text: userMessage, isUser: true });
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage);
      
      // Check if response includes appointment scheduling tag
      const shouldSchedule = response.includes('[SCHEDULE_APPOINTMENT]');
      const cleanResponse = response.replace('[SCHEDULE_APPOINTMENT]', '').trim();
      
      if (shouldSchedule) {
        setShowAppointmentModal(true);
      }
      
      addMessage({ text: cleanResponse, isUser: false });
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentResponse = (schedule: boolean) => {
    if (schedule) {
      closeChat();
      navigate('/contact');
    } else {
      // Add a follow-up message when user chooses to continue chat
      addMessage({
        text: "I understand you'd like to continue our conversation. Please let me know if you have any other concerns or questions about your condition.",
        isUser: false
      });
    }
  };

  if (!isChatOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ top: '5rem' }}
      className="fixed bottom-4 right-4 w-96 h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-[0_2px_12px_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_0_rgba(0,0,0,0.24)] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <MessageCircle size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-white">PhysioAI Assistant</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Online</p>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex flex-col gap-2 max-w-[85%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-md shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-2xl rounded-bl-md border border-gray-100 dark:border-gray-700 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Chatbot;