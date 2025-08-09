import React, { useState } from "react";
import { Search, Plus, NotebookPen, PenBox } from "lucide-react";

const Conversation = () => {
  const [addMode, setAddMode] = useState(false);

  return (
    <div className="flex flex-col h-full w-100 bg-card/50 backdrop-blur-sm border-r border-border/50">
      <div className="mt-5 px-4">
        <div className="flex bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 gap-x-3 items-center text-muted-foreground">
          <Search className="h-4 w-4" />
          <input
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-foreground placeholder-muted-foreground focus:ring-0"
            placeholder="Search conversations..."
          />
        </div>
        <div className="inline-flex items-center gap-2 px-4 mt-5 mb-5 cursor-pointer hover:bg-background rounded-lg p-2 pr-20 transition-colors">
          <PenBox />
          <button>New Chat</button> 
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-0 border-t border-border/30">
        <span className="inline-flex items-center gap-2 mt-3 text-muted-foreground cursor-pointer">
          Chats
        </span>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4">
        {[
          { name: "Balram", msg: "Hello" },
          { name: "Radha", msg: "Hello" },
          { name: "Arjuna", msg: "Hello" },
        ].map((user, idx) => (
          <div
            key={user.name}
            className="flex cursor-pointer mt-5 items-center border-b border-border/30 pb-3 hover:bg-background rounded-lg p-2 transition-colors">
            <img
              className="object-cover border-border border-2 rounded-full"
              src={`https://placehold.co/50x50/png/?text=${user.name[0]}`}
              width={50}
              height={50}
              alt="UserImage"
            />
            <div className="pl-5">
              <span className="font-bold text-foreground">{user.name}</span>
              <p className="text-muted-foreground">{user.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversation;
