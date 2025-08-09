import { useEffect, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LoadingMessage } from "@/components/LoadingMessage";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-background">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ChatHeader />
        
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
            {isLoading && <LoadingMessage />}
          </div>
        </ScrollArea>

        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
