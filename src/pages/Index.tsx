import { useEffect, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LoadingMessage } from "@/components/LoadingMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationSidebar from "@/components/ConversationSidebar";

const Index = () => {
  const { messages, isLoading, sendMessage, activeConversationId } =
    useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex h-screen bg-gradient-background">
      <ConversationSidebar />

      <div className="w-full flex flex-col bg-gradient-background">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
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
    </div>
  );
};

export default Index;
