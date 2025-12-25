import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, UserCheck, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-up">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <Bot className="h-4 w-4 text-foreground" />
      </div>
      <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function MessageStatus({ status }: { status: Message["status"] }) {
  return (
    <span className="inline-flex items-center ml-1">
      {status === "sending" && (
        <span className="w-3 h-3 border border-current/40 border-t-transparent rounded-full animate-spin" />
      )}
      {status === "sent" && (
        <Check className="h-3 w-3 opacity-60" />
      )}
      {status === "delivered" && (
        <CheckCheck className="h-3 w-3 opacity-60" />
      )}
      {status === "read" && (
        <CheckCheck className="h-3 w-3 text-accent" />
      )}
    </span>
  );
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 👋 I'm your Biblioscape assistant. How can I help you today? I can answer questions about orders, shipping, book recommendations, and more!",
      timestamp: new Date(),
      status: "read",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.role === "assistant" && msg.status !== "read"
            ? { ...msg, status: "read" as const }
            : msg
        )
      );
    }
  }, [isOpen]);

  const sendMessage = async (requestHuman = false) => {
    if (!input.trim() && !requestHuman) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: requestHuman ? "I'd like to speak with a human agent please." : input.trim(),
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate sending delay
    await new Promise((r) => setTimeout(r, 300));
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === userMessage.id ? { ...msg, status: "sent" as const } : msg
      )
    );

    // Simulate delivery
    await new Promise((r) => setTimeout(r, 400));
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg
      )
    );

    // Show typing indicator
    setIsTyping(true);

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

      // Mark user message as read
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "read" as const } : msg
        )
      );

      // Small delay before showing response for natural feel
      await new Promise((r) => setTimeout(r, 500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        status: "delivered",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Mark as read after a moment
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id ? { ...msg, status: "read" as const } : msg
          )
        );
      }, 500);
      
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
        status: "read",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                {isEscalated ? (
                  <UserCheck className="h-5 w-5 text-accent" />
                ) : (
                  <Bot className="h-5 w-5 text-accent" />
                )}
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">
                {isEscalated ? "Support Team" : "Biblioscape Assistant"}
              </h3>
              <p className="text-xs text-primary-foreground/60 flex items-center gap-1">
                {isTyping ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Typing...
                  </>
                ) : isEscalated ? (
                  "A human agent will respond soon"
                ) : (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Online
                  </>
                )}
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
                <div
                  className={cn(
                    "flex items-center gap-1 text-[10px] mt-1 opacity-60",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <span>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "user" && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Human Support Button */}
        {!isEscalated && (
          <div className="px-4 py-2 border-t border-border/50">
            <button
              onClick={() => sendMessage(true)}
              disabled={isTyping}
              className="w-full text-center text-sm text-muted-foreground hover:text-accent transition-colors py-2 disabled:opacity-50"
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
              disabled={isTyping}
              className="flex-1 rounded-full border-border/50 focus:border-accent"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
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
