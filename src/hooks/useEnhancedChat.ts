import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConversations, ChatMessage } from "@/hooks/useConversations";

export const useEnhancedChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    conversations,
    activeConversationId,
    currentMessages,
    createNewConversation,
    switchToConversation,
    updateConversation,
    addMessageToConversation,
    deleteConversation,
    initializeIfEmpty,
  } = useConversations();

  // Initialize first conversation on mount
  useEffect(() => {
    initializeIfEmpty();
  }, [initializeIfEmpty]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!activeConversationId) {
        console.error("No active conversation");
        return;
      }

      const userMsgId = Date.now().toString();
      const userMsg: ChatMessage = {
        id: userMsgId,
        message: userMessage,
        isUser: true,
        timestamp: new Date(),
      };

      // Add user message to current conversation
      addMessageToConversation(activeConversationId, userMsg);
      setIsLoading(true);

      try {
        // Call the backend API with current thread ID
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            thread_id: activeConversationId, // Use conversation ID as thread ID
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Create bot response
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.reply || "I'm sorry, I couldn't process that request.",
          isUser: false,
          timestamp: new Date(),
        };

        // Add bot message to current conversation
        addMessageToConversation(activeConversationId, botMsg);

        // Update conversation metadata
        updateConversation(
          activeConversationId,
          botMsg.message,
          // Auto-generate title from first user message if still default
          conversations.find((c) => c.id === activeConversationId)?.title ===
            "New Chat with Krishna"
            ? `Chat: ${userMessage.substring(0, 30)}...`
            : undefined
        );

        // Optional: Show success toast for testing
        // toast({
        //   title: "Message sent",
        //   description: "Krishna has responded to your message.",
        // });
      } catch (error) {
        console.error("Chat API error:", error);

        // Add error message
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message:
            "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        };

        addMessageToConversation(activeConversationId, errorMsg);
        updateConversation(activeConversationId, errorMsg.message);

        console.log("About to show error toast"); // Debug log
        toast({
          title: "Connection Error",
          description:
            "Unable to reach the chat service. Please check your connection.",
          variant: "destructive",
        });
        console.log("Error toast called"); // Debug log
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeConversationId,
      addMessageToConversation,
      updateConversation,
      conversations,
      toast,
    ]
  );

  const startNewChat = useCallback(() => {
    const newConversationId = createNewConversation();

    // Show success notification
    console.log("About to show new chat toast"); // Debug log
    toast({
      title: "New Chat Created",
      description: "Started a new conversation with Krishna.",
    });
    console.log("New chat toast called"); // Debug log

    return newConversationId;
  }, [createNewConversation, toast]);

  const switchConversation = useCallback(
    (conversationId: string) => {
      switchToConversation(conversationId);

      // Show switch notification
      const conversation = conversations.find((c) => c.id === conversationId);
      toast({
        title: "Conversation Switched",
        description: `Switched to: ${
          conversation?.title || "Unknown conversation"
        }`,
      });
    },
    [switchToConversation, conversations, toast]
  );

  const clearCurrentChat = useCallback(() => {
    if (activeConversationId) {
      deleteConversation(activeConversationId);
    }
  }, [activeConversationId, deleteConversation]);

  return {
    // Messages for current conversation
    messages: currentMessages,
    isLoading,
    sendMessage,

    // Conversation management
    conversations,
    activeConversationId,
    switchToConversation: switchConversation,
    startNewChat,
    clearCurrentChat,

    // Current thread ID (for debugging)
    threadId: activeConversationId,
  };
};
