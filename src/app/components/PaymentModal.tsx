import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet, Bitcoin, CheckCircle2, ShieldCheck, AlertCircle, Copy, ExternalLink, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

import { useStore } from "./utils/store";

type PaymentMethod = "naira" | "crypto" | "escrow";

export function PaymentModal({ isOpen, onClose, amount, itemName }: { isOpen: boolean, onClose: () => void, amount: string, itemName: string }) {
  const { addNotification } = useStore();
  const [method, setMethod] = useState<PaymentMethod>("naira");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      
      addNotification({
        title: "Purchase Successful",
        message: `You have successfully purchased ${itemName} for ${amount}.`,
        time: "Just now",
        type: "order"
      });

      toast.success("Payment successful!", {
        description: method === "escrow" ? "Funds are now locked in Smart Contract Escrow." : "Your order is being processed.",
      });
    }, 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    toast.success("Address copied!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-primary p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="h-24 w-24" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-white">Secure Checkout</DialogTitle>
            <DialogDescription className="text-white/80 font-bold">
              Pay for <span className="text-white underline">{itemName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Total Amount</p>
            <p className="text-5xl font-black mt-1">{amount}</p>
          </div>
        </div>

        <div className="p-8 bg-white">
          {step === 1 ? (
            <Tabs value={method} onValueChange={(v: string) => setMethod(v as PaymentMethod)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="naira" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Naira</TabsTrigger>
                <TabsTrigger value="crypto" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Crypto</TabsTrigger>
                <TabsTrigger value="escrow" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Escrow</TabsTrigger>
              </TabsList>

              <TabsContent value="naira" className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#0F172A]">Smart Escrow Protection</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Your funds are secured by OUI's Smart Escrow. The vendor only receives payment after you confirm delivery.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#0F172A]">Verified OUI Vendor</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        This vendor has been identity-verified by the OUI Market security team.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="p-4 border-2 border-primary/20 rounded-2xl bg-primary/5 flex items-center gap-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-black text-sm text-primary">Card / Bank Transfer</p>
                      <p className="text-xs text-muted-foreground font-bold">Pay via Flutterwave or Paystack</p>
                    </div>
                  </div>
                  <Input placeholder="Card Number" className="h-12 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" className="h-12 rounded-xl" />
                    <Input placeholder="CVV" className="h-12 rounded-xl" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4">
                <div className="p-6 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-2 rounded-xl shadow-lg">
                      <QrCode className="h-32 w-32 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Send USDT/ETH to:</p>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-xl border shadow-inner">
                    <code className="text-[10px] font-bold truncate flex-1">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="escrow" className="space-y-4">
                <div className="bg-secondary/5 border-2 border-secondary/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="h-6 w-6 text-secondary" />
                    <p className="font-black text-secondary">Trustless Escrow Protection</p>
                  </div>
                  <p className="text-xs text-secondary/80 font-bold leading-relaxed">
                    Funds will be held in our smart contract. The vendor will only receive payment after you confirm delivery. If there's a dispute, our moderators will step in.
                  </p>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <AlertCircle className="h-4 w-4" />
                  Network: OUI Mainnet / Polygon
                </div>
              </TabsContent>

              <Button onClick={handlePay} disabled={loading} className="w-full h-14 bg-primary text-white font-black text-lg rounded-2xl shadow-xl mt-6">
                {loading ? "Processing..." : `Pay ${amount}`}
              </Button>
            </Tabs>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Payment Confirmed!</h3>
                <p className="text-muted-foreground font-bold mt-2">Your receipt has been sent to your email.</p>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <Button className="h-12 rounded-xl font-black" onClick={onClose}>Done</Button>
                <Button variant="outline" className="h-12 rounded-xl font-black flex items-center gap-2">
                  View on Explorer <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <CreditCard className="h-6 w-6" />
            <Bitcoin className="h-6 w-6" />
            <Wallet className="h-6 w-6" />
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-6 font-bold uppercase tracking-widest">
            PCI DSS COMPLIANT • SSL SECURED • SMART CONTRACT VERIFIED
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
