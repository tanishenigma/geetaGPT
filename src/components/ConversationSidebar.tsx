import React, { useState } from "react";
import {
  Search,
  Plus,
  MessageCircle,
  Trash2,
  Calendar,
  PenBox,
} from "lucide-react";
import { useChatContext } from "@/hooks/useChatContext";
import { formatDistanceToNow } from "date-fns";

interface ConversationSidebarProps {
  className?: string;
}

const ConversationSidebar = ({ className }: ConversationSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(0);

  const {
    conversations,
    activeConversationId,
    switchToConversation,
    startNewChat,
    clearCurrentChat,
  } = useChatContext();

  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    startNewChat();
  };
  const handleNotification = () => {
    setNotifications((prev) => prev + 1);
  };

  const handleDeleteConversation = (
    e: React.MouseEvent,
    conversationId: string
  ) => {
    e.stopPropagation();
    clearCurrentChat();
  };

  return (
    <div
      className={`flex flex-col h-full w-80 bg-card/50 backdrop-blur-sm border-r border-border/50 ${className}`}>
      {/* Search Bar */}
      <div className="mt-5 px-4">
        <div className="flex bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 gap-x-3 items-center text-muted-foreground">
          <Search className="h-4 w-4 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-foreground placeholder-muted-foreground focus:ring-0"
            placeholder="Search conversations..."
          />
        </div>

        {/* New Chat Button */}
        <div
          className="inline-flex items-center gap-2 px-4 mt-5 mb-5 cursor-pointer hover:bg-background rounded-lg p-2 pr-20 transition-colors"
          onClick={handleNewChat}>
          <PenBox />
          <button className="text-foreground ">New Chat</button>
        </div>
      </div>

      {/* Conversations Header */}
      <div className="flex items-center justify-between px-4 py-0 border-t border-border/30">
        <span className="inline-flex items-center gap-2 mt-3 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          My Conversations ({conversations.length})
        </span>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 ">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => switchToConversation(conversation.id)}
              className={`
					flex cursor-pointer mt-3 items-start border-b border-border/30 pb-3 
					hover:bg-background/30 rounded-lg p-3 transition-colors group
					${
            activeConversationId === conversation.id
              ? "bg-background/50 border-primary/30"
              : ""
          }
					`}>
              {/* Krishna Avatar */}
              <div className="flex-shrink-0"></div>

              {/* Conversation Details */}
              <div className="pl-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm truncate">
                    {conversation.title}
                  </span>

                  {/* Delete Button - only show on hover or active */}
                  {conversations.length > 1 && (
                    <button
                      onClick={(e) =>
                        handleDeleteConversation(e, conversation.id)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                      title="Delete conversation">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  )}
                </div>

                <p className="text-muted-foreground text-xs mt-1 truncate">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(conversation.timestamp, {
                      addSuffix: true,
                    })}
                  </span>

                  {notifications > 0 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(0);
                      }}
                      className="text-xs text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors">
                      {notifications} new
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
    </div>
  );
};

export default ConversationSidebar;
