import { motion } from "framer-motion";
import { HelpCircle, BookOpen, ShieldCheck, ShoppingBag, MessageSquare, Zap, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const guides = [
  {
    title: "Getting Started",
    icon: Zap,
    description: "New to OUI Market? Learn how to set up your account and start exploring the best campus deals.",
    steps: [
      "Click the Account icon in the header to create your profile.",
      "Verify your student email (@oduduwa.edu.ng) to get the Verified Badge.",
      "Browse categories or use the search bar to find exactly what you need."
    ]
  },
  {
    title: "Buying Safely",
    icon: ShoppingBag,
    description: "We prioritize your safety. Here's how to ensure a smooth purchase experience.",
    steps: [
      "Look for the 'Verified Vendor' badge on products for maximum security.",
      "Use our built-in chat to ask vendors questions before buying.",
      "Always meet in public campus areas for physical item exchanges."
    ]
  },
  {
    title: "Selling & Gigs",
    icon: CheckCircle2,
    description: "Turn your skills or items into cash. OUI Market is the best place to reach students.",
    steps: [
      "Go to the 'Vendor Portal' to list your first product or service.",
      "Provide clear photos and detailed descriptions to attract buyers.",
      "Respond quickly to messages to build your vendor trust score."
    ]
  },
  {
    title: "Escrow & Payments",
    icon: ShieldCheck,
    description: "Our smart contract escrow protects your money until the job is done.",
    steps: [
      "For gigs, payments are held securely in our system.",
      "Funds are only released when you confirm the service is complete.",
      "Multiple payment options: Bank Transfer, Card, or Crypto."
    ]
  }
];

export function HelpCenter() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <div className="bg-[#0F172A] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6"
          >
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Base</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">How can we <span className="text-primary">help you?</span></h1>
          <p className="text-white/60 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Welcome to the OUI Market Help Center. Find everything you need to navigate Nigeria's biggest university marketplace with ease and security.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <section id="guides">
              <h2 className="text-2xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                User Guides
              </h2>
              <div className="grid gap-6">
                {guides.map((guide, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-2 border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all group">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <guide.icon className="h-8 w-8" />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-black text-[#0F172A] mb-2">{guide.title}</h3>
                              <p className="text-slate-500 font-medium leading-relaxed">{guide.description}</p>
                            </div>
                            <ul className="space-y-3">
                              {guide.steps.map((step, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                                    {sIdx + 1}
                                  </div>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  { q: "Is OUI Market limited to only OUI students?", a: "While our focus is the OUI community, local vendors near campus can also register. However, 'Verified Student' tags are strictly for OUI students." },
                  { q: "What happens if a vendor doesn't deliver?", a: "For gig-based services, your payment is protected by escrow. For physical items, we recommend public meetings. You can always report a vendor using the 'Report Issue' link." },
                  { q: "How do I become a 'Verified Vendor'?", a: "Submit your student ID or business registration in the Vendor Portal. Our team reviews all applications within 24-48 hours." }
                ].map((faq, idx) => (
                  <Card key={idx} className="border-2 border-slate-100 rounded-3xl">
                    <CardContent className="p-6">
                      <h4 className="font-black text-[#0F172A] mb-2">{faq.q}</h4>
                      <p className="text-sm text-slate-500 font-medium">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MessageSquare className="h-24 w-24" />
              </div>
              <h3 className="text-2xl font-black mb-4 relative z-10">Still need help?</h3>
              <p className="text-white/60 font-medium mb-8 relative z-10">
                Our support team and AI assistant are available 24/7 to help with any issues.
              </p>
              <Button 
                onClick={() => {
                  const store = (window as any).useStore;
                  if (store) store.getState().setSupportOpen(true);
                }}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 group"
              >
                Chat with Support
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <Card className="border-2 border-slate-100 rounded-[2.5rem]">
              <CardContent className="p-8">
                <h3 className="text-lg font-black text-[#0F172A] mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="#/vendor" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 group transition-all">
                    <span className="font-bold text-slate-600 group-hover:text-primary">Vendor Portal</span>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                  <a href="#/jobs" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 group transition-all">
                    <span className="font-bold text-slate-600 group-hover:text-primary">Gig Marketplace</span>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                  <a href="#/report" className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 group transition-all">
                    <span className="font-bold text-rose-600">Report a Scam</span>
                    <ArrowRight className="h-4 w-4 text-rose-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
