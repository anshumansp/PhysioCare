import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateResponse } from '../services/huggingface';
import useStore from '../store/useStore';
import { Send, Calendar, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showAppointmentButtons?: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: "Hello! I'm your PhysioAI assistant. How can I help you with your physical health today? Please describe any pain or discomfort you're experiencing.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setShowAppointmentModal, showChat, setShowChat } = useStore();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset conversation context when chat is opened
    if (showChat) {
      import('../services/huggingface').then(({ resetContext }) => {
        resetContext();
      });
    }
  }, [showChat]);

  const handleAppointmentResponse = (schedule: boolean) => {
    setMessages(prev => prev.map(msg => ({
      ...msg,
      showAppointmentButtons: false
    })));

    if (schedule) {
      setShowChat(false);
      navigate('/contact');
    } else {
      // Add a follow-up message when user chooses to continue chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I understand you'd like to continue our conversation. Please let me know if you have any other concerns or questions about your condition.",
        timestamp: new Date(),
      }]);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await generateResponse(message);
      
      const shouldSchedule = response.includes('[SCHEDULE_APPOINTMENT]');
      const cleanResponse = response.replace('[SCHEDULE_APPOINTMENT]', '');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: cleanResponse.trim() + (shouldSchedule ? '\n\nBased on your symptoms, I recommend scheduling an appointment with one of our physiotherapists for a thorough assessment. Would you like to schedule an appointment now?' : ''),
        timestamp: new Date(),
        showAppointmentButtons: shouldSchedule
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try describing your condition again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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
          onClick={() => setShowChat(false)}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex flex-col gap-2 max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-md shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-2xl rounded-bl-md border border-gray-100 dark:border-gray-700 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.showAppointmentButtons && (
                  <div className="flex flex-col gap-2 w-full mt-1">
                    <button
                      onClick={() => handleAppointmentResponse(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-sm transition-colors duration-200"
                    >
                      <Calendar size={16} />
                      <span>Schedule Appointment</span>
                    </button>
                    <button
                      onClick={() => handleAppointmentResponse(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors duration-200"
                    >
                      <MessageCircle size={16} />
                      <span>Continue Chat</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md border border-gray-100 dark:border-gray-700 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
        className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-500 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Chatbot;