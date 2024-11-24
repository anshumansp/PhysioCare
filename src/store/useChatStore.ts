import { create } from 'zustand';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatStore {
  isChatOpen: boolean;
  messages: Message[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatOpen: false,
  messages: [
    { text: "Hi! I'm your PhysioAssist AI. How can I help you today?", isUser: false }
  ],
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({
    messages: [{ text: "Hi! I'm your PhysioAssist AI. How can I help you today?", isUser: false }]
  }),
}));
