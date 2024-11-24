import React, { useRef, useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/useChatStore';

const responses = {
  greeting: ["Hello! How can I assist you today?", "Hi there! What brings you to PhysioCare AI?"],
  pain: ["I understand you're experiencing pain. Could you tell me where exactly it hurts and how long you've been experiencing this?", "I'm sorry to hear you're in pain. To better assist you, could you describe the location and nature of your pain?"],
  appointment: ["I can help you schedule an appointment. Our next available slots are tomorrow at 10 AM and 2 PM. Would either of these work for you?", "I'd be happy to help you book an appointment. We have openings this week. What day works best for you?"],
  services: ["We offer various physiotherapy services including manual therapy, exercise prescription, and rehabilitation programs. Would you like to know more about any specific service?"],
  default: ["I'm here to help! Could you provide more details about your concern?", "I'd be happy to assist you. Could you elaborate on your question?"]
};

const getResponse = (input: string) => {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerInput.includes('pain') || lowerInput.includes('hurt')) {
    return responses.pain[Math.floor(Math.random() * responses.pain.length)];
  } else if (lowerInput.includes('appointment') || lowerInput.includes('book')) {
    return responses.appointment[Math.floor(Math.random() * responses.appointment.length)];
  } else if (lowerInput.includes('service')) {
    return responses.services[0];
  }
  return responses.default[Math.floor(Math.random() * responses.default.length)];
};

const Chatbot = () => {
  const { isChatOpen, closeChat, messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage({ text: input, isUser: true });
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const response = getResponse(input);
      addMessage({ text: response, isUser: false });
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-96 h-[32rem] flex flex-col"
            ref={chatContainerRef}
          >
            <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <span className="font-semibold">PhysioAssist AI</span>
              <button
                onClick={closeChat}
                className="hover:text-primary-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-hover text-gray-900 dark:text-dark-text'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="p-4 border-t dark:border-dark-hover">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border dark:border-dark-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-dark-hover dark:text-dark-text"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;