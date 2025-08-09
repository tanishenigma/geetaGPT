import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled || isLoading}
            className={cn(
              "min-h-[44px] max-h-32 resize-none pr-12 transition-all duration-200",
              "focus:ring-2 focus:ring-primary/50 border-border/50",
              "bg-background/50 backdrop-blur-sm"
            )}
            rows={1}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className={cn(
            "h-11 w-11 p-0 bg-gradient-primary hover:opacity-90 transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-lg hover:shadow-xl hover:scale-105"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
};