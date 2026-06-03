import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 800); // Wait for exit animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "circOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]"
        >
          {/* Animated Background Elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <div className="relative mb-8">
              {/* Modern Logo Shape */}
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "backOut" }}
                className="h-28 w-28 mx-auto relative"
              >
                <div className="absolute inset-0 bg-primary rounded-3xl rotate-12 opacity-20 animate-pulse" />
                <div className="absolute inset-0 bg-primary rounded-3xl -rotate-6 shadow-2xl flex items-center justify-center border-2 border-white/10">
                  <span className="text-5xl font-black text-white tracking-tighter">O</span>
                </div>
              </motion.div>
              
              {/* Particle Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-4 border-2 border-dashed border-primary/30 rounded-full"
              />
            </div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2"
              >
                OUI <span className="text-primary">MARKET</span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-white/60 font-bold tracking-[0.4em] uppercase text-[10px]">
                The Future of Campus Commerce
              </p>
              
              {/* Progress Bar */}
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-12 left-0 right-0 text-center"
          >
            <p className="text-white/20 text-xs font-black tracking-widest uppercase">
              Powered by OUI Tech Society
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
