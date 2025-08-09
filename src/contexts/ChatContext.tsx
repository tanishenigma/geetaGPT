import React, { createContext, useContext, ReactNode } from "react";
import { useEnhancedChat } from "@/hooks/useEnhancedChat";
import { ChatMessage, Conversation } from "@/hooks/useConversations";

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  switchToConversation: (id: string) => void;
  startNewChat: () => void;
  clearCurrentChat: () => void;
  threadId: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export { ChatContext };

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const chatData = useEnhancedChat();

  return (
    <ChatContext.Provider value={chatData}>{children}</ChatContext.Provider>
  );
};
