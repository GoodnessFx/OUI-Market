import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useStore } from "./utils/store";
import { toast } from "sonner";

type Message = {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
};

export function SupportChat() {
  const { 
    isSupportOpen: isOpen, 
    setSupportOpen: setIsOpen, 
    supportMessages: messages, 
    addSupportMessage,
    user 
  } = useStore();
  const [message, setMessage] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!message.trim()) return;

    addSupportMessage({
      text: message,
      sender: isAdminMode ? "support" : "user",
      userId: user?.id || "anonymous"
    });

    setMessage("");

    if (!isAdminMode) {
      setIsTyping(true);
      // Simulate AI response if not in admin mode
      setTimeout(() => {
        addSupportMessage({
          text: "Thanks for your message! Our support team has been notified and will get back to you shortly.",
          sender: "support",
          userId: user?.id || "anonymous"
        });
        setIsTyping(false);
      }, 1500);
    }
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
                    <span className="text-xl font-black text-white">{isAdminMode ? "A" : "O"}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-[#0F172A] rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">{isAdminMode ? "Admin Console" : "OUI Support"}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-black">
                      {isAdminMode ? "Replying as Support" : "AI Assistant Online"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                {user?.isAdmin && (
                  <button
                    onClick={() => {
                      setIsAdminMode(!isAdminMode);
                      toast.info(isAdminMode ? "Switched to User Mode" : "Switched to Admin Mode", {
                        description: isAdminMode ? "You are now chatting as a customer." : "You are now replying as OUI Support.",
                      });
                    }}
                    className={`text-[9px] font-black px-3 py-1.5 rounded-full border transition-all duration-300 ${
                      isAdminMode 
                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-105" 
                        : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    {isAdminMode ? "ADMIN ACTIVE" : "GO ADMIN"}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4" viewportRef={scrollRef}>
              <div className="py-6 space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.5rem] p-4 text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                        msg.sender === "user"
                          ? "bg-[#0F172A] text-white rounded-tr-none"
                          : "bg-slate-50 text-slate-900 border border-slate-100 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                      <p
                        className={`text-[9px] mt-2 font-black uppercase tracking-widest ${
                          msg.sender === "user" ? "text-white/40 text-right" : "text-slate-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] rounded-tl-none p-4 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
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
