import { Search, ShoppingCart, Bell, User, Menu, HelpCircle, ChevronDown, Package, Heart, Settings, LogOut, CreditCard, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";

export function Header() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setShowHelpMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-4">
              <a href="#/vendor" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Sell on OUIMarket
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={helpMenuRef}>
                <button
                  onClick={() => {
                    setShowHelpMenu(!showHelpMenu);
                    setShowAccountMenu(false);
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Help</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showHelpMenu ? 'rotate-180' : ''}`} />
                </button>
                {showHelpMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <a href="#help" className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors">Help Center</a>
                    <a href="#contact" className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors">Contact Us</a>
                    <a href="#faq" className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors">FAQs</a>
                    <a href="#track" className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors">Track Order</a>
                    <div className="border-t my-2"></div>
                    <a href="#report" className="block px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors">Report Issue</a>
                  </div>
                )}
              </div>
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => {
                    setShowAccountMenu(!showAccountMenu);
                    setShowHelpMenu(false);
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Account</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                </button>
                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b">
                      <p className="font-bold text-sm">Welcome back!</p>
                      <p className="text-xs text-muted-foreground mt-0.5">adebayo.m@oduduwa.edu.ng</p>
                    </div>
                    <div className="py-2">
                      <a href="#account" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors">
                        <User className="h-4 w-4 text-primary" />
                        <span>My Account</span>
                      </a>
                      <a href="#orders" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors">
                        <Package className="h-4 w-4 text-primary" />
                        <span>Orders</span>
                      </a>
                      <a href="#wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors">
                        <Heart className="h-4 w-4 text-primary" />
                        <span>Saved Items</span>
                      </a>
                      <a href="#wallet" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Wallet</span>
                      </a>
                      <a href="#addresses" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Addresses</span>
                      </a>
                      <a href="#settings" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors">
                        <Settings className="h-4 w-4 text-primary" />
                        <span>Settings</span>
                      </a>
                    </div>
                    <div className="border-t py-2">
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors w-full font-semibold">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex h-16 items-center gap-4 px-4">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
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

          <div className="flex-1 max-w-2xl">
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="search"
                placeholder="Search products, services & more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 h-10 bg-muted/50 border focus-visible:ring-primary transition-all"
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-10 px-6 rounded-l-none bg-primary hover:bg-primary/90 transition-all active:scale-95"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-2 hover:bg-primary/5 transition-all"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <User className="h-4 w-4" />
              <span>Account</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-2 hover:bg-primary/5 transition-all"
              onClick={() => setShowHelpMenu(!showHelpMenu)}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-white text-[10px] font-semibold flex items-center justify-center animate-pulse">
                3
              </span>
            </Button>

            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-all">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-white text-[10px] font-semibold flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t bg-white hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-10 text-sm font-medium">
            <a href="#/all-products" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">All Categories</a>
            <a href="#/products/food" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Food & Drinks</a>
            <a href="#/products/fashion" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Fashion</a>
            <a href="#/products/electronics" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Electronics</a>
            <a href="#/products/services" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Services</a>
            <a href="#/housing" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Housing</a>
            <a href="#/jobs" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Jobs</a>
            <a href="#/chat" className="px-3 py-2 text-slate-600 hover:text-primary transition-all font-bold">Messages</a>
          </div>
        </div>
      </div>
    </header>
  );
}
