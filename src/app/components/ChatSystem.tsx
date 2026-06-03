import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Bot, Paperclip, MessageSquare, BadgeCheck, Phone, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  lastMsg: string;
};

const CONTACTS: ChatUser[] = [
  { id: "1", name: "OUI Tech Hub", avatar: "https://github.com/shadcn.png", isOnline: true, isVerified: true, lastMsg: "Is the laptop still available?" },
  { id: "2", name: "Sarah (Housing Agent)", avatar: "https://github.com/shadcn.png", isOnline: false, isVerified: true, lastMsg: "The hostel tour is tomorrow at 4." },
  { id: "3", name: "Campus Delivery", avatar: "https://github.com/shadcn.png", isOnline: true, isVerified: false, lastMsg: "I'm outside your hostel now." },
];

type Message = {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
};

export function ChatSystem() {
  const [selectedContact, setSelectedContact] = useState<ChatUser | null>(CONTACTS[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I'm interested in the product you listed.", sender: "user", timestamp: new Date() },
    { id: "2", text: "Great! It's still available. When would you like to check it out?", sender: "other", timestamp: new Date() },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), text: message, sender: "user", timestamp: new Date() };
    setMessages((prev: Message[]) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-100px)]">
      <Card className="grid grid-cols-1 md:grid-cols-12 h-full border-4 shadow-2xl rounded-[2.5rem] overflow-hidden">
        {/* Sidebar */}
        <div className="md:col-span-4 border-r-2 bg-muted/20 flex flex-col">
          <div className="p-6 border-b-2">
            <h2 className="text-2xl font-black mb-4">Messages</h2>
            <div className="relative">
              <Input placeholder="Search chats..." className="bg-white rounded-xl h-11 pl-4" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {CONTACTS.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    selectedContact?.id === contact.id ? "bg-primary text-white shadow-xl" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1">
                      <p className={`font-black text-sm ${selectedContact?.id === contact.id ? "text-white" : "text-foreground"}`}>
                        {contact.name}
                      </p>
                      {contact.isVerified && <BadgeCheck className={`h-4 w-4 ${selectedContact?.id === contact.id ? "text-white/80" : "text-blue-500"}`} />}
                    </div>
                    <p className={`text-xs line-clamp-1 ${selectedContact?.id === contact.id ? "text-white/70" : "text-muted-foreground"}`}>
                      {contact.lastMsg}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {selectedContact ? (
            <>
              <div className="p-6 border-b-2 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg">{selectedContact.name}</h3>
                      {selectedContact.isVerified && <BadgeCheck className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-muted"><Phone className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-muted"><Video className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-muted"><X className="h-5 w-5" /></Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-8 bg-muted/5">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] space-y-2`}>
                        <div className={`p-4 rounded-2xl font-medium shadow-sm ${
                          msg.sender === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white border-2 text-foreground rounded-tl-none"
                        }`}>
                          {msg.text}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${msg.sender === "user" ? "text-right text-muted-foreground" : "text-muted-foreground"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 bg-white border-t-2">
                <div className="flex gap-4 items-center bg-muted/30 p-2 rounded-2xl border-2">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl"><Paperclip className="h-5 w-5" /></Button>
                  <Input
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="border-0 bg-transparent focus-visible:ring-0 text-base font-medium h-12"
                  />
                  <Button onClick={handleSend} className="h-12 px-6 bg-primary text-white font-black rounded-xl shadow-lg">
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black mb-2">Select a chat to start messaging</h3>
              <p className="text-muted-foreground font-bold max-w-sm">Connect with vendors, buyers, and agents directly on the OUI Market platform.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
