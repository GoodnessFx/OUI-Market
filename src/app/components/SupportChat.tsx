import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useStore } from "./utils/store";

type Message = {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
};

export function SupportChat() {
  const { isSupportOpen: isOpen, setSupportOpen: setIsOpen } = useStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to OUI Market Support. How can we help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMsg]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const supportMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! A member of our support team (or our AI assistant) will be with you shortly. We're currently processing your request.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, supportMsg]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-muted overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0F172A] p-6 text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg border-2 border-white/10">
                    <span className="text-xl font-black text-white">O</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-[#0F172A] rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">OUI Support</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-black">AI Assistant Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-sm font-medium shadow-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === "user" ? "text-white/60 text-right" : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2 bg-white rounded-xl border p-1 shadow-inner">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="border-0 focus-visible:ring-0 h-9 text-sm"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="h-9 w-9 bg-primary hover:bg-primary/90 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-3 font-bold uppercase tracking-tighter">
                Powered by OUI Market AI Support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-16 w-16 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.3)] transition-all duration-500 border-2 border-white/20 ${
          isOpen ? "rotate-180 bg-[#0F172A] text-white" : "bg-[#0F172A] hover:bg-black text-white hover:scale-110 active:scale-95"
        }`}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </Button>
    </div>
  );
}
