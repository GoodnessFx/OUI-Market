import { ArrowRight, Percent, Sparkles, Home, ShoppingBag, Store } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=1600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?w=1600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1600&h=800&fit=crop"
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev: number) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/10"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Campus Marketplace</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] leading-[0.95] tracking-tighter mb-6">
                Everything <br />
                <span className="text-primary">Campus</span> <br />
                Simplified.
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
                Join the largest student-driven economy at OUI. Buy, sell, and discover services from verified peers in your community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                onClick={() => window.location.hash = "#/all-products"}
                size="lg" 
                className="h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-slate-200 transition-all active:scale-95 group"
              >
                Start Shopping
                <ShoppingBag className="h-5 w-5 ml-3 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button 
                onClick={() => window.location.hash = "#/vendor"}
                variant="outline" 
                size="lg" 
                className="h-16 px-10 border-2 border-slate-200 hover:border-primary hover:bg-primary/5 text-[#0F172A] font-black text-lg rounded-2xl transition-all"
              >
                Become a Vendor
                <Store className="h-5 w-5 ml-3" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 pt-8 border-t border-slate-100"
            >
              <div>
                <p className="text-2xl font-black text-[#0F172A]">100+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Students</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div>
                <p className="text-2xl font-black text-[#0F172A]">30+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Shops</p>
              </div>
            </motion.div>
          </div>

          {/* Visual Content - Figma Style Showcase */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white bg-slate-100">
              {images.map((img, idx) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentImage === idx ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "linear" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${img}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
                </motion.div>
              ))}
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
