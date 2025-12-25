import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 👋 I'm your Biblioscape assistant. How can I help you today? I can answer questions about orders, shipping, book recommendations, and more!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (requestHuman = false) => {
    if (!input.trim() && !requestHuman) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: requestHuman ? "I'd like to speak with a human agent please." : input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for API (excluding welcome message)
      const apiMessages = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));
      
      apiMessages.push({ role: "user", content: userMessage.content });

      const { data, error } = await supabase.functions.invoke("live-chat", {
        body: { messages: apiMessages, requestHuman },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (data.escalated) {
        setIsEscalated(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting. Please try again or email us at support@biblioscape.com",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-gold flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-2xl border border-border/50 flex flex-col transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        )}
        style={{ height: "min(600px, calc(100vh - 6rem))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-charcoal rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              {isEscalated ? (
                <UserCheck className="h-5 w-5 text-accent" />
              ) : (
                <Bot className="h-5 w-5 text-accent" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">
                {isEscalated ? "Support Team" : "Biblioscape Assistant"}
              </h3>
              <p className="text-xs text-primary-foreground/60">
                {isEscalated ? "A human agent will respond soon" : "Usually replies instantly"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-up",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  message.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={cn(
                    "text-[10px] mt-1 opacity-60",
                    message.role === "user" ? "text-right" : "text-left"
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4 text-foreground" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Human Support Button */}
        {!isEscalated && (
          <div className="px-4 py-2 border-t border-border/50">
            <button
              onClick={() => sendMessage(true)}
              disabled={isLoading}
              className="w-full text-center text-sm text-muted-foreground hover:text-accent transition-colors py-2"
            >
              <UserCheck className="inline h-4 w-4 mr-1" />
              Talk to a human agent
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 rounded-full border-border/50 focus:border-accent"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              size="icon"
              variant="gold"
              className="rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
