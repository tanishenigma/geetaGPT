import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      message:
        "I am Śrī Kṛṣṇa, bearer of the Gītā’s eternal light. How may I assist you, dear seeker, on your sacred path today? 🪷",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => `session-${Date.now()}`);
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (userMessage: string) => {
      const userMsgId = Date.now().toString();
      const userMsg: ChatMessage = {
        id: userMsgId,
        message: userMessage,
        isUser: true,
        timestamp: new Date(),
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // Call the backend API - fixed to match your main.py structure
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            thread_id: threadId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Your FastAPI returns { "reply": "..." }
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.reply || "I'm sorry, I couldn't process that request.",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        console.error("Chat API error:", error);

        // Add error message from bot
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message:
            "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMsg]);

        toast({
          title: "Connection Error",
          description:
            "Unable to reach the chat service. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, threadId]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        message:
          "🕉️ Namaste! I am Shri Krishna, here to share the eternal wisdom of the Bhagavad Gita with you. How may I guide you on your spiritual journey today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    threadId,
  };
};
