import { Avatar } from "@/components/ui/avatar";
import { Bot, Sparkles } from "lucide-react";

export const LoadingMessage = () => {
  return (
    <div className="flex items-start gap-3 mb-6 animate-slideInUp opacity-0 animation-delay-100">
      {/* Enhanced Avatar with divine golden animations */}
      <div className="relative group">
        <Avatar className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400/30 shadow-lg shadow-yellow-500/20 transition-all duration-300 group-hover:scale-110">
          <Bot className="w-5 h-5 text-white animate-pulse" />
        </Avatar>

        {/* Divine pulsing rings */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/10 animate-pulse" />

        {/* Divine thinking indicator */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles
            className="w-3 h-3 text-white animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>
      </div>

      {/* Enhanced divine message bubble */}
      <div className="relative bg-gradient-to-br from-amber-50/90 to-yellow-50/90 dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-yellow-900/20 text-amber-900 dark:text-amber-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-yellow-200/50 dark:border-yellow-600/30 backdrop-blur-sm overflow-hidden max-w-[200px]">
        {/* Divine shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -skew-x-12 animate-shimmer" />

        <div className="relative z-10 flex items-center gap-3">
          {/* Divine dot animation */}
          <div className="flex gap-1">
            <div
              className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "0ms" }}></div>
            <div
              className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "200ms" }}></div>
            <div
              className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "400ms" }}></div>
          </div>

          {/* Divine thinking text */}
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300 animate-pulse">
            Contemplating...
          </span>
        </div>

        {/* Divine progress bar */}
        <div className="mt-2 w-full h-1 bg-yellow-200/50 dark:bg-yellow-800/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-progress shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};
