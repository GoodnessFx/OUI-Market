import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Store, Upload, UserCheck, AlertCircle, BadgeCheck, PlusCircle, LayoutDashboard, Wallet, Boxes } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { useStore } from "./utils/store";

export function VendorPortal() {
  const { user, setVendorStatus, addNotification } = useStore();
  const [step, setStep] = useState(user?.isVendor ? 3 : 1);
  const [isVerified, setIsVerified] = useState(user?.verified || false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success("Account created! Now let's verify your identity.");
    }, 1500);
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsVerified(true);
      setVendorStatus(true);
      setStep(3);
      
      addNotification({
        title: "Vendor Account Activated",
        message: "Congratulations! Your vendor account is now active and verified.",
        time: "Just now",
        type: "system"
      });

      toast.success("Verification successful! You now have a verification tag.", {
        icon: <BadgeCheck className="h-5 w-5 text-blue-500" />,
      });
    }, 2000);
  };

  const handleWithdraw = () => {
    toast.info("Withdrawal request initiated", {
      description: "We are processing your request to withdraw funds to your linked bank account.",
    });
    
    setTimeout(() => {
      addNotification({
        title: "Withdrawal Successful",
        message: "Your withdrawal of ₦0.00 has been processed successfully.",
        time: "Just now",
        type: "payout"
      });
    }, 3000);
  };

  const handleListProduct = () => {
    toast.success("Redirecting to product listing page...");
  };

  const handleManageInventory = () => {
    toast.success("Opening inventory manager...");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Store className="h-5 w-5" />
            <span className="text-sm font-black uppercase tracking-widest">Vendor Excellence Program</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Grow Your Business on OUI Market</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
            Join 200+ verified student and local vendors. Get discovered, sell safely, and build your brand.
          </p>
        </div>

        <Tabs value={step.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-14 bg-muted/50 p-1 rounded-2xl">
            <TabsTrigger value="1" disabled={step !== 1} className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              1. Registration
            </TabsTrigger>
            <TabsTrigger value="2" disabled={step !== 2} className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              2. Verification
            </TabsTrigger>
            <TabsTrigger value="3" disabled={step !== 3} className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              3. Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="1">
            <Card className="border-2 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary/5 p-8">
                <CardTitle className="text-2xl font-black">Vendor Account Details</CardTitle>
                <CardDescription className="font-bold">Enter your business information to get started.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="biz-name" className="font-bold">Business Name</Label>
                      <Input id="biz-name" placeholder="e.g. OUI Tech Hub" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="font-bold">Category</Label>
                      <Input id="category" placeholder="e.g. Electronics, Fashion" required className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Student Email / Official Email</Label>
                    <Input id="email" type="email" placeholder="vendor@oui.edu.ng" required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc" className="font-bold">Business Description</Label>
                    <Input id="desc" placeholder="Tell us what you sell..." className="h-12" />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-14 bg-primary text-white font-black text-lg rounded-xl shadow-xl hover:shadow-primary/20 transition-all">
                    {loading ? "Creating Account..." : "Register as Vendor"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 shadow-xl rounded-3xl overflow-hidden border-blue-100">
                <CardHeader className="bg-blue-50 p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-2xl font-black text-blue-900">Identity Verification</CardTitle>
                  </div>
                  <CardDescription className="text-blue-700 font-bold">Upload your ID to receive the OUI Verified Tag.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center bg-blue-50/30 group hover:bg-blue-50/50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <p className="font-black text-blue-900">Upload Student ID or NIN</p>
                    <p className="text-xs text-blue-600 font-bold mt-2 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                      Verification increases buyer trust by 85% and gives you access to the Escrow payment system.
                    </p>
                  </div>
                  <Button onClick={handleVerify} disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-xl shadow-blue-200">
                    {loading ? "Verifying..." : "Submit for Verification"}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border-2 shadow-lg">
                  <h3 className="text-xl font-black mb-4">Why get verified?</h3>
                  <ul className="space-y-4">
                    {[
                      "Trust Badge on your profile",
                      "Lower transaction fees",
                      "Priority listing in search results",
                      "Access to Smart Contract Escrow",
                      "Instant Payouts to Bank/Crypto"
                    ].map((text) => (
                      <li key={text} className="flex items-center gap-3 font-bold text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="3">
            <Card className="border-4 border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="p-12 text-center space-y-8">
                <div className="relative inline-block">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-4 border-white shadow-2xl">
                    <Store className="h-16 w-16 text-primary" />
                  </div>
                  {isVerified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-xl"
                    >
                      <BadgeCheck className="h-10 w-10 text-blue-500 fill-blue-50" />
                    </motion.div>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl font-black flex items-center justify-center gap-3">
                    OUI Tech Hub
                    {isVerified && <span className="text-blue-500 text-sm font-black bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Verified</span>}
                  </h2>
                  <p className="text-muted-foreground font-bold mt-2">vendor@oui.edu.ng • Member since June 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Active Listings", value: "0" },
                    { label: "Total Sales", value: "₦0.00" },
                    { label: "Rating", value: "N/A" },
                    { label: "Trust Score", value: isVerified ? "98%" : "10%" }
                  ].map((stat) => (
                    <div key={stat.label} className="bg-muted/30 p-6 rounded-3xl border-2 border-transparent hover:border-primary/20 transition-all">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-primary">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button onClick={handleListProduct} className="h-14 px-8 bg-primary font-black text-lg rounded-2xl shadow-xl flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    List New Product
                  </Button>
                  <Button onClick={handleManageInventory} variant="outline" className="h-14 px-8 border-2 font-black text-lg rounded-2xl flex items-center gap-2">
                    <Boxes className="h-5 w-5" />
                    Manage Inventory
                  </Button>
                  <Button onClick={handleWithdraw} variant="secondary" className="h-14 px-8 font-black text-lg rounded-2xl flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg shadow-amber-200">
                    <Wallet className="h-5 w-5" />
                    Withdraw Funds
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
