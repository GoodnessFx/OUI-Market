import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, PlusCircle, Briefcase, Clock, ShieldCheck, Star, ArrowRight, CheckCircle2, MessageSquare, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useStore } from "./utils/store";
import { toast } from "sonner";

const GIGS = [
  {
    id: 1,
    title: "Help with Law Assignment",
    description: "Need a summary of the Nigerian Legal System for a 200-level course. Must be well-referenced.",
    budget: 3500,
    deadline: "24 Hours",
    category: "Academic",
    poster: "Adebayo M.",
    posterRating: 4.8,
    verified: true,
  },
  {
    id: 2,
    title: "Logo Design for Campus Brand",
    description: "Looking for a creative student to design a professional logo for a new clothing line.",
    budget: 15000,
    deadline: "3 Days",
    category: "Design",
    poster: "OUI Tech Hub",
    posterRating: 5.0,
    verified: true,
  },
  {
    id: 3,
    title: "Private Tutoring: MAT 101",
    description: "Weekly sessions for Calculus and Algebra. Physical or online meetings.",
    budget: 5000,
    deadline: "Ongoing",
    category: "Tutoring",
    poster: "Sarah K.",
    posterRating: 4.5,
    verified: false,
  }
];

export function TaskMarketplace() {
  const { user } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleApply = (title: string) => {
    toast.success(`Application sent for: ${title}`, {
      description: "The poster will review your OUI Score and get back to you.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trustless P2P Economy</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tighter">
              Task <span className="text-primary">Gigs</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              The student-to-student service economy. Secure payments, verified reputations, zero ghosting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search gigs..." 
                className="pl-12 h-14 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus-visible:ring-primary"
              />
            </div>
            <Button className="w-full sm:w-auto h-14 px-8 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl shadow-slate-200 flex items-center gap-3">
              <PlusCircle className="h-5 w-5" />
              Post a Task
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Tasks", value: "48", icon: Briefcase, color: "text-blue-500" },
            { label: "Avg. Budget", value: "₦4,500", icon: Wallet, color: "text-emerald-500" },
            { label: "Completion Rate", value: "94%", icon: CheckCircle2, color: "text-primary" },
            { label: "Disputes Resolved", value: "100%", icon: ShieldCheck, color: "text-amber-500" }
          ].map((stat, i) => (
            <Card key={i} className="border-2 border-slate-100 rounded-3xl shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-slate-50 ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-[#0F172A]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gigs List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4 px-4">
            <h2 className="text-xl font-black text-[#0F172A]">Available Gigs</h2>
            <button className="flex items-center gap-2 text-xs font-black uppercase text-primary hover:underline">
              <Filter className="h-3 w-3" /> Filters
            </button>
          </div>

          <div className="grid gap-6">
            {GIGS.map((gig) => (
              <motion.div 
                key={gig.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest">
                        {gig.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Ends in {gig.deadline}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-[#0F172A] mb-3 group-hover:text-primary transition-colors">{gig.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{gig.description}</p>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                          {gig.poster[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-black text-[#0F172A]">{gig.poster}</p>
                            {gig.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-black">{gig.posterRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-slate-100" />
                      <div className="flex items-center gap-2 text-primary font-black">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] uppercase tracking-widest">Payment Protected</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64 flex flex-col justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-3xl font-black text-[#0F172A]">₦{gig.budget.toLocaleString()}</p>
                    </div>
                    <Button 
                      onClick={() => handleApply(gig.title)}
                      className="w-full h-14 bg-[#0F172A] hover:bg-primary text-white font-black rounded-2xl shadow-xl transition-all"
                    >
                      Apply Now
                    </Button>
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                      Message Poster
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="p-10 bg-[#0F172A] rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tighter mb-4">How Smart Escrow Works</h3>
              <ul className="space-y-4">
                {[
                  { t: "Funds Secured", d: "When you post a task, your Naira is locked in a secure digital safe." },
                  { t: "Verification", d: "The doer submits work. You review and approve it." },
                  { t: "Instant Release", d: "Once approved, funds move instantly to the doer's bank." }
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs flex-shrink-0">{i+1}</div>
                    <div>
                      <p className="font-black text-sm">{step.t}</p>
                      <p className="text-xs text-white/50 font-medium">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <ShieldCheck className="absolute -bottom-8 -right-8 h-48 w-48 text-white/5 rotate-12" />
          </div>

          <div className="p-10 bg-primary rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tighter mb-4">Community Justice</h3>
              <p className="text-white/80 font-bold mb-6">
                Disputes are resolved by our most trusted Diamond-tier students. Earn ₦100 per vote by keeping the campus marketplace fair.
              </p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-slate-50 font-black h-12 px-8 rounded-xl text-sm uppercase tracking-widest">
                Learn About Tiers
              </Button>
            </div>
            <Star className="absolute -bottom-8 -right-8 h-48 w-48 text-white/10 -rotate-12" />
          </div>
        </div>

      </div>
    </div>
  );
}
