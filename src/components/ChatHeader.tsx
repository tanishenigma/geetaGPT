import { Bot, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export const ChatHeader = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/health", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.log("Backend is offline:", error);
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately
    checkBackendStatus();

    // Check every 10 seconds
    const interval = setInterval(checkBackendStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm p-4 relative overflow-hidden rounded-xl mt-2 shadow-lg md:mx-5 mx-2">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-amber-500/10 animate-pulse" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-yellow-500/50">
              <img
                className="w-10 h-10 rounded-full object-cover transition-transform duration-300 "
                src="/krsna.png"
                alt="Krishna"
              />
            </div>

            {/* Divine sparkles indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <Sparkles
                className="w-3 h-3 text-white animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>

            {/* Divine pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent animate-fadeIn">
                Bhagavān Kṛṣṇa
              </h1>

              {/* Status indicator */}
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                    isChecking
                      ? "bg-yellow-500 animate-pulse"
                      : isOnline
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {isChecking ? "Checking..." : isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1 animate-slideInLeft">
              <Zap
                className="w-3 h-3 text-yellow-500 animate-bounce"
                style={{ animationDuration: "2s" }}
              />
              <span className="text-yellow-300/80">
                Wisdom of the Bhagavad Gita
              </span>
            </p>
          </div>
        </div>

        {/* Divine activity indicator */}
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-yellow-500/80 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-amber-500/80 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-orange-500/80 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      {/* Divine floating particles effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-2 left-1/4 w-1 h-1 bg-yellow-400/30 rounded-full animate-float" />
        <div
          className="absolute top-3 right-1/3 w-1 h-1 bg-amber-400/40 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-2 left-1/2 w-1 h-1 bg-orange-400/35 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
};
