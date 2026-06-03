import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertCircle, User, Store, Bug, MessageSquare, ArrowLeft, CheckCircle2, Upload, Flag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { toast } from "sonner";
import { useStore } from "./utils/store";

type ReportType = "scam" | "vendor" | "bug" | "user" | "other";

export function ReportIssue() {
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      addNotification({
        title: "Report Received",
        message: "Your report has been received and is being reviewed by our security team.",
        time: "Just now",
        type: "system"
      });
      toast.success("Report submitted successfully! We'll investigate immediately.");
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter">Report Submitted</h2>
            <p className="text-slate-500 font-bold mt-4 leading-relaxed">
              Thank you for helping keep OUI Market safe. Our moderators will review the case and take action within 12-24 hours.
            </p>
          </div>
          <Button 
            onClick={() => window.location.hash = "#/"}
            className="w-full h-14 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl"
          >
            Back to Marketplace
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-black uppercase tracking-widest mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>

          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-6"
            >
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Security & Safety</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter mb-4">Report an Issue</h1>
            <p className="text-slate-500 font-medium text-lg">Help us maintain a safe community for all OUI students.</p>
          </div>

          {!reportType ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: "scam", label: "Report a Scam", icon: ShieldAlert, color: "rose", desc: "Fraudulent items or payment requests" },
                { id: "vendor", label: "Vendor Issue", icon: Store, color: "orange", desc: "Non-delivery or poor service" },
                { id: "bug", label: "Technical Bug", icon: Bug, color: "blue", desc: "App errors or functional issues" },
                { id: "user", label: "User Harassment", icon: User, color: "purple", desc: "Inappropriate chat or behavior" },
                { id: "other", label: "Other", icon: AlertCircle, color: "slate", desc: "Anything else we should know" }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id as ReportType)}
                  className="flex flex-col items-start p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all group text-left"
                >
                  <div className={`h-14 w-14 rounded-2xl bg-${type.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <type.icon className={`h-7 w-7 text-${type.color}-500`} />
                  </div>
                  <h3 className="text-xl font-black text-[#0F172A] mb-2">{type.label}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{type.desc}</p>
                </button>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl bg-white">
                <CardHeader className="bg-slate-50 p-10 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-black">Report Details</CardTitle>
                    <button 
                      onClick={() => setReportType(null)}
                      className="text-xs font-black uppercase text-primary hover:underline"
                    >
                      Change Type
                    </button>
                  </div>
                  <CardDescription className="font-bold">Provide as much information as possible to help us investigate.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject / Username of interest</Label>
                      <Input placeholder="e.g. @vendor_name or Order #12345" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" required />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Describe what happened</Label>
                      <textarea 
                        className="w-full min-h-[150px] p-6 rounded-3xl bg-slate-50 border-none font-bold focus:ring-2 ring-primary/20 resize-none"
                        placeholder="Tell us the details..."
                        required
                      />
                    </div>

                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <Upload className="h-10 w-10 text-slate-300 mx-auto mb-4 group-hover:text-primary transition-colors" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Upload Evidence (Screenshots/Receipts)</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-2">JPG, PNG up to 10MB</p>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-rose-50 rounded-2xl border border-rose-100">
                      <Flag className="h-6 w-6 text-rose-500 flex-shrink-0 mt-1" />
                      <p className="text-xs text-rose-700 font-bold leading-relaxed">
                        Flagging a user or vendor initiates an internal review. Multiple flags will lead to temporary or permanent account suspension.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-rose-200 transition-all"
                    >
                      {loading ? "Processing Report..." : "Submit Official Report"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
