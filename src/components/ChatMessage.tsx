import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

export const ChatMessage = ({
  message,
  isUser,
  timestamp,
}: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 mb-4 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
      <Avatar
        className={cn(
          "w-8 h-8 border-2 shadow-lg",
          isUser
            ? "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400/30 shadow-orange-500/20"
            : "bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400/30 shadow-yellow-500/20"
        )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <img
            className="w-full h-full rounded-full object-cover"
            src="/krsna.png"
            alt="Krishna"
          />
        )}
      </Avatar>

      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 shadow-lg",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-assistant text-chat-assistant-foreground rounded-bl-md border border-border/50"
        )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-60 mt-1">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
};
