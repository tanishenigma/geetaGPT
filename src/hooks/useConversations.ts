import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const useConversations = () => {
  // Store all conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Current active conversation ID
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Store messages for each conversation
  const [conversationMessages, setConversationMessages] = useState<
    Record<string, ChatMessage[]>
  >({});

  // Create a new conversation
  const createNewConversation = useCallback(() => {
    const newId = `thread-${uuidv4()}`;
    const newConversation: Conversation = {
      id: newId,
      title: "New Chat with Krishna",
      lastMessage: "I am Śrī Kṛṣṇa, bearer of the Gītā's eternal light...",
      timestamp: new Date(),
      messageCount: 1,
    };

    // Add welcome message for new conversation
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      message:
        "I am Śrī Kṛṣṇa, bearer of the Gītā's eternal light. How may I assist you, dear seeker, on your sacred path today? 🪷",
      isUser: false,
      timestamp: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setConversationMessages((prev) => ({
      ...prev,
      [newId]: [welcomeMessage],
    }));
    setActiveConversationId(newId);

    return newId;
  }, []);

  // Switch to existing conversation
  const switchToConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
  }, []);

  // Update conversation after new message
  const updateConversation = useCallback(
    (conversationId: string, lastMessage: string, title?: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage:
                  lastMessage.substring(0, 50) +
                  (lastMessage.length > 50 ? "..." : ""),
                timestamp: new Date(),
                messageCount: conv.messageCount + 1,
                title: title || conv.title,
              }
            : conv
        )
      );
    },
    []
  );

  // Add message to specific conversation
  const addMessageToConversation = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setConversationMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message],
      }));
    },
    []
  );

  // Delete conversation
  const deleteConversation = useCallback(
    (conversationId: string) => {
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
      setConversationMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[conversationId];
        return newMessages;
      });

      // If deleting active conversation, switch to first available or create new
      if (activeConversationId === conversationId) {
        const remaining = conversations.filter(
          (conv) => conv.id !== conversationId
        );
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          const newId = createNewConversation();
          setActiveConversationId(newId);
        }
      }
    },
    [activeConversationId, conversations, createNewConversation]
  );

  // Get messages for current conversation
  const getCurrentMessages = useCallback(() => {
    if (!activeConversationId) return [];
    return conversationMessages[activeConversationId] || [];
  }, [activeConversationId, conversationMessages]);

  // Initialize with first conversation if none exist
  const initializeIfEmpty = useCallback(() => {
    if (conversations.length === 0 && !activeConversationId) {
      createNewConversation();
    }
  }, [conversations.length, activeConversationId, createNewConversation]);

  return {
    conversations,
    activeConversationId,
    currentMessages: getCurrentMessages(),
    createNewConversation,
    switchToConversation,
    updateConversation,
    addMessageToConversation,
    deleteConversation,
    initializeIfEmpty,
  };
};
