import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "./ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-muted p-6 backdrop-blur-xl bg-white/95">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg">Cookie Notice</h3>
                  <button
                    onClick={() => setShow(false)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                  We use cookies to enhance your campus shopping experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={accept}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-11"
                  >
                    Accept All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShow(false)}
                    className="flex-1 font-bold h-11"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
