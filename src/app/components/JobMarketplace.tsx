import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, ShieldCheck, MapPin, Clock, Search, Filter, Plus, BadgeCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { PaymentModal } from "./PaymentModal";

type Job = {
  id: string;
  title: string;
  category: string;
  budget: string;
  location: string;
  postedBy: string;
  isVerified: boolean;
  description: string;
};

const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Website UI/UX Design",
    category: "Tech",
    budget: "₦25,000",
    location: "Remote / Campus",
    postedBy: "OUI Tech Society",
    isVerified: true,
    description: "Looking for a student designer to revamp our society landing page. Must be proficient in Figma.",
  },
  {
    id: "2",
    title: "Hostel Delivery Assistant",
    category: "Logistics",
    budget: "₦500 / trip",
    location: "Main Campus",
    postedBy: "John D.",
    isVerified: false,
    description: "Need someone to help deliver food orders from the cafeteria to various hostels during evenings.",
  },
  {
    id: "3",
    title: "Math Tutor (MAT101)",
    category: "Education",
    budget: "₦2,000 / hour",
    location: "Library",
    postedBy: "Sarah W.",
    isVerified: true,
    description: "Struggling with calculus. Need a 200L or 300L student to help with MAT101 prep.",
  },
];

export function JobMarketplace() {
  const [jobs] = useState<Job[]>(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsPaymentOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Student Gigs & Jobs</h1>
          <p className="text-muted-foreground font-bold text-lg">Earn money while studying. Safe, secure, and trustless.</p>
        </div>
        <Button className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-secondary/20">
          <Plus className="h-5 w-5 mr-2" />
          Post a Gig
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl font-black">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search gigs..." className="pl-10 h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Category</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Tech", "Logistics", "Education", "Creative"].map((cat) => (
                    <Badge key={cat} variant={cat === "All" ? "default" : "outline"} className="px-4 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h4 className="font-black text-primary">Escrow Protection</h4>
            </div>
            <p className="text-sm font-medium text-primary/80 leading-relaxed">
              All job payments are locked in our <strong>Smart Contract Escrow</strong>. Funds are only released when both parties are satisfied.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none font-black rounded-lg">{job.category}</Badge>
                        {job.isVerified && (
                          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-600 font-black rounded-lg gap-1">
                            <BadgeCheck className="h-3 w-3" /> Verified Poster
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground font-bold text-sm">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted 2h ago</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.postedBy}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-2xl font-black text-primary">{job.budget}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-dashed">
                    <div className="flex items-center gap-2 text-xs font-black text-secondary uppercase tracking-widest">
                      <DollarSign className="h-4 w-4" />
                      Smart Contract Enabled
                    </div>
                    <Button onClick={() => handleApply(job)} className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-xl shadow-lg">
                      Apply for Gig
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          amount={selectedJob.budget}
          itemName={`Gig: ${selectedJob.title}`}
        />
      )}
    </div>
  );
}
