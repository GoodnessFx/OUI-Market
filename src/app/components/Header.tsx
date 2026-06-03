import { Search, ShoppingCart, Bell, User, Menu, HelpCircle, ChevronDown, Package, Heart, Settings, LogOut, CreditCard, MapPin, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { useStore } from "./utils/store";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { user, notifications, markNotificationRead, markAllNotificationsRead, setSupportOpen, logout } = useStore();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    window.location.hash = "#/";
    setShowAccountMenu(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center gap-6">
              {/* Top links removed as per user request for professional look */}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => {
                    setShowAccountMenu(!showAccountMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-wider"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{user ? user.name : 'Account'}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showAccountMenu && user && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="bg-[#0F172A] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                          <User className="h-32 w-32" />
                        </div>
                        <div className="flex items-center gap-5 mb-6 relative z-10">
                          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-black shadow-2xl">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-black text-xl tracking-tighter">{user.name}</p>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full w-fit relative z-10">
                          {user.isVendor ? <Store className="h-3.5 w-3.5 text-primary" /> : <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            {user.isVendor ? 'Verified Vendor' : 'Verified Student'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-3">
                        <a href="#/account" onClick={() => setShowAccountMenu(false)} className="flex flex-col items-center gap-2 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <User className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Profile</span>
                        </a>
                        <a href="#/orders" onClick={() => setShowAccountMenu(false)} className="flex flex-col items-center gap-2 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Package className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Orders</span>
                        </a>
                        <a href="#/wallet" onClick={() => setShowAccountMenu(false)} className="flex flex-col items-center gap-2 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Wallet</span>
                        </a>
                        <a href="#/settings" onClick={() => setShowAccountMenu(false)} className="flex flex-col items-center gap-2 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Settings className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Settings</span>
                        </a>
                      </div>
                      <div className="p-6 border-t border-slate-50 bg-slate-50/50">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-rose-200"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex h-20 items-center gap-8 px-4">
          <button className="lg:hidden text-slate-900">
            <Menu className="h-7 w-7" />
          </button>

          <a href="#/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="h-11 w-11 rounded-2xl bg-[#0F172A] flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
              <span className="text-2xl font-black text-white tracking-tighter">O</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-black text-[#0F172A] leading-tight tracking-tighter">OUI MARKET</div>
              <div className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Marketplace</div>
            </div>
          </a>

          <div className="flex-1 max-w-2xl hidden md:block">
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="search"
                placeholder="Search for textbooks, hostels, electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-14 h-12 bg-slate-100 border-none rounded-2xl focus-visible:ring-primary/20 transition-all font-medium text-slate-900"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 h-10 w-12 rounded-xl bg-[#0F172A] hover:bg-black transition-all active:scale-95"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`relative h-12 w-12 rounded-2xl transition-all ${showNotifications ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'}`}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowAccountMenu(false);
                  setShowHelpMenu(false);
                }}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-[380px] bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50"
                  >
                      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-[#0F172A]">Notifications</h3>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => markAllNotificationsRead()}
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
                          >
                            Mark all read
                          </button>
                          <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{unreadCount} New</span>
                        </div>
                      </div>
                      <ScrollArea className="h-[400px] overscroll-contain">
                        <div className="p-2 space-y-1">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <button 
                                key={n.id}
                                onClick={() => markNotificationRead(n.id)}
                                className={`w-full text-left p-4 rounded-3xl transition-all flex items-start gap-4 ${n.read ? 'opacity-50 hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}`}
                              >
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                  n.type === 'order' ? 'bg-orange-100 text-orange-600' : 
                                  n.type === 'message' ? 'bg-blue-100 text-blue-600' : 
                                  n.type === 'sale' ? 'bg-green-100 text-green-600' :
                                  n.type === 'payout' ? 'bg-purple-100 text-purple-600' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {n.type === 'order' ? <Package className="h-5 w-5" /> : 
                                   n.type === 'message' ? <MessageSquare className="h-5 w-5" /> : 
                                   n.type === 'sale' ? <Store className="h-5 w-5" /> :
                                   n.type === 'payout' ? <CreditCard className="h-5 w-5" /> :
                                   <Bell className="h-5 w-5" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-black text-xs text-slate-900">{n.title}</p>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{n.time}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                </div>
                                {!n.read && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
                              </button>
                            ))
                          ) : (
                            <div className="py-12 text-center">
                              <Bell className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                              <p className="text-sm font-bold text-slate-400">All caught up!</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    <div className="p-4 bg-slate-50 text-center">
                      <button 
                        onClick={() => {
                          window.location.hash = "#/notifications";
                          setShowNotifications(false);
                        }}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        View all activity
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-slate-100 text-slate-600 relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-[#0F172A] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                2
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t bg-white hidden md:block border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12 text-[11px] font-black uppercase tracking-[0.15em]">
            <a href="#/all-products" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">All Categories</a>
            <a href="#/products/food" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Food & Drinks</a>
            <a href="#/products/fashion" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Fashion</a>
            <a href="#/products/electronics" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Electronics</a>
            <a href="#/products/services" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Services</a>
            <a href="#/housing" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Housing</a>
            <a href="#/jobs" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Jobs</a>
            <a href="#/chat" className="px-4 py-2 text-slate-500 hover:text-primary transition-all">Messages</a>
          </div>
        </div>
      </div>
    </header>
  );
}
