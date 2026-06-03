import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, CreditCard, Settings, Copy, Share2, TrendingUp, Wallet, ArrowRight, History, Gift, CheckCircle2, LogOut, Bell, MessageSquare, HelpCircle, ShieldAlert, Info, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useStore } from "./utils/store";
import { toast } from "sonner";

export function UserDashboard({ view = "profile" }: { view?: string }) {
  const { user, notifications, markNotificationRead, markAllNotificationsRead, updateBalance, addNotification, setSupportOpen, logout } = useStore();
  const [copied, setCopied] = useState(false);

  if (!user) {
    // If not logged in, show a simple message or redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Please log in to view dashboard</h2>
          <Button onClick={() => window.location.hash = "#/"}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.hash = "#/";
    toast.success("Logged out successfully");
  };

  const handleSimulateReferral = () => {
    updateBalance(500);
    addNotification({
      title: "Referral Bonus!",
      message: "You just earned ₦500 from a new student referral.",
      time: "Just now",
      type: "order"
    });
    toast.success("₦500 added to your wallet!");
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderView = () => {
    switch (view) {
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-[#0F172A]">All Notifications</h2>
              <Button 
                variant="ghost" 
                onClick={markAllNotificationsRead}
                className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5"
              >
                Mark all as read
              </Button>
            </div>
            <div className="grid gap-4">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Card 
                    key={n.id} 
                    className={`border-2 transition-all rounded-[2rem] overflow-hidden ${n.read ? 'border-slate-50 opacity-60' : 'border-primary/10 bg-primary/5 shadow-lg shadow-primary/5'}`}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          n.type === 'order' ? 'bg-orange-100 text-orange-600' : 
                          n.type === 'message' ? 'bg-blue-100 text-blue-600' : 
                          n.type === 'sale' ? 'bg-green-100 text-green-600' :
                          n.type === 'payout' ? 'bg-purple-100 text-purple-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {n.type === 'order' ? <Package className="h-8 w-8" /> : 
                           n.type === 'message' ? <MessageSquare className="h-8 w-8" /> : 
                           n.type === 'sale' ? <TrendingUp className="h-8 w-8" /> :
                           n.type === 'payout' ? <CreditCard className="h-8 w-8" /> :
                           <Bell className="h-8 w-8" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-black text-lg text-[#0F172A]">{n.title}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time}</span>
                          </div>
                          <p className="text-slate-500 font-medium leading-relaxed text-sm">{n.message}</p>
                          {!n.read && (
                            <Button 
                              variant="link" 
                              onClick={() => markNotificationRead(n.id)}
                              className="p-0 h-auto mt-4 text-xs font-black uppercase tracking-widest text-primary"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
                  <Bell className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-[#0F172A] mb-2">All caught up!</h3>
                  <p className="text-slate-500 font-medium">You don't have any new notifications at the moment.</p>
                </div>
              )}
            </div>
          </div>
        );
      case "wallet":
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#0F172A] text-white border-none rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Wallet className="h-32 w-32" />
                </div>
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Total Balance</CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-4">
                  <h2 className="text-5xl font-black mb-8">₦{user.walletBalance.toLocaleString()}</h2>
                  <div className="flex gap-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-xl">Top Up</Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black px-8 h-12 rounded-xl">Withdraw</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl bg-primary/5">
                <CardHeader className="p-10 pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl font-black">Refer & Earn</CardTitle>
                  </div>
                  <CardDescription className="font-bold text-slate-500">Get ₦500 for every student you refer to OUI Market.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-6">
                  <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Referral Code</p>
                      <p className="text-xl font-black text-primary">{user.referralCode}</p>
                    </div>
                    <Button onClick={copyReferral} size="icon" variant="ghost" className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Referrals</p>
                      <p className="text-xl font-black text-[#0F172A]">{user.referralsCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Earned</p>
                      <p className="text-xl font-black text-green-600">₦{user.referralEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <History className="h-6 w-6 text-primary" />
                    Transaction History
                  </CardTitle>
                </div>
                <Button variant="ghost" className="font-black text-xs uppercase tracking-widest text-primary">Download Statement</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {[
                    { type: "Refund", desc: "Refund for Order #8271", amount: "+₦1,500", date: "June 2, 2026", status: "Completed" },
                    { type: "Purchase", desc: "Paid for AirPods Pro 2", amount: "-₦185,000", date: "May 28, 2026", status: "Completed" },
                    { type: "Referral", desc: "Referral Bonus (Student: John D.)", amount: "+₦500", date: "May 25, 2026", status: "Completed" }
                  ].map((tx, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${tx.amount.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                          {tx.amount.startsWith('+') ? <TrendingUp className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-black text-sm text-[#0F172A]">{tx.desc}</p>
                          <p className="text-xs font-bold text-slate-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-[#0F172A]'}`}>{tx.amount}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8">
            <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-black">Account Settings</CardTitle>
                <CardDescription className="font-bold">Manage your account preferences and security.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:text-primary transition-colors">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-sm">Privacy & Security</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Passwords, 2FA, Sessions</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all" />
                  </button>
                  <button className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:text-primary transition-colors">
                        <Bell className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-sm">Notifications</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email, Push, Alerts</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all" />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-black">Help & Support</CardTitle>
                <CardDescription className="font-bold">Get assistance and find answers to your questions.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSupportOpen(true)}
                  className="flex items-center gap-4 p-6 rounded-[2rem] bg-primary/5 hover:bg-primary/10 border-2 border-transparent hover:border-primary/20 transition-all group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-primary">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-primary">Help Center</p>
                    <p className="text-[10px] font-bold text-primary/60 uppercase">Chat with our 24/7 support</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.location.hash = "#/help#faq"}
                  className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:text-primary transition-colors">
                    <Info className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm">FAQs</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Find quick answers</p>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.hash = "#/report"}
                  className="flex items-center gap-4 p-6 rounded-[2rem] bg-rose-50 hover:bg-rose-100 border-2 border-transparent hover:border-rose-200 transition-all group col-span-full"
                >
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-rose-500">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-rose-600">Report an Issue</p>
                    <p className="text-[10px] font-bold text-rose-400 uppercase">Report scams, bugs, or vendors</p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        );
      case "orders":
        return (
          <div className="text-center py-20 bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
            <Package className="h-16 w-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-[#0F172A] mb-2">No active orders</h3>
            <p className="text-slate-500 font-medium">Your recent orders will appear here once you make a purchase.</p>
            <Button onClick={() => window.location.hash = "#/"} className="mt-8 bg-[#0F172A] text-white font-black px-8 h-12 rounded-xl">Start Shopping</Button>
          </div>
        );
      default:
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-2 border-slate-100 rounded-[2.5rem] overflow-hidden h-fit shadow-sm">
              <div className="bg-slate-900 p-8 text-center text-white relative">
                <div className="relative z-10">
                  <div className="h-24 w-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-2xl">
                    {user.name[0]}
                  </div>
                  <h3 className="text-2xl font-black mb-1">{user.name}</h3>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-widest">{user.email}</p>
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Verified Student</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Member Since</span>
                  <span className="font-black text-[#0F172A]">June 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Account Type</span>
                  <span className="font-black text-[#0F172A]">Student Buyer</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Campus</span>
                  <span className="font-black text-[#0F172A]">OUI Main Campus</span>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-black">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <Input defaultValue={user.name} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <Input defaultValue={user.email} disabled className="h-12 rounded-xl bg-slate-50 border-none font-bold opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <Input placeholder="+234 000 000 0000" className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</label>
                      <Input placeholder="OUI/STU/..." className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                  </div>
                  <Button className="h-14 px-10 bg-primary text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20">Update Profile</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Dashboard Sidebar */}
          <div className="md:w-72 flex-shrink-0 space-y-4">
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter mb-8 px-4">Dashboard</h1>
            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile", icon: User, path: "#/account" },
                { id: "notifications", label: "Notifications", icon: Bell, path: "#/notifications" },
                { id: "wallet", label: "Wallet & Referral", icon: Wallet, path: "#/wallet" },
                { id: "orders", label: "My Orders", icon: Package, path: "#/orders" },
                { id: "settings", label: "Settings", icon: Settings, path: "#/settings" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => window.location.hash = item.path}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest ${
                    view === item.id ? "bg-[#0F172A] text-white shadow-2xl scale-[1.02]" : "text-slate-500 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-8 px-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-rose-500 font-black text-sm uppercase tracking-widest hover:underline transition-all"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderView()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
