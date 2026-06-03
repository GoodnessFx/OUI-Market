import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

export function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-primary via-primary to-primary/90 border-y relative overflow-hidden" id="vendor">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=400&fit=crop&blend=0A4D2E&blend-mode=multiply&blend-alpha=85')] bg-cover bg-center opacity-10"></div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 mb-5 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold text-secondary">VENDOR PROGRAM</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Start <span className="text-secondary">Selling</span> on OUIMarket Today
          </h2>

          <p className="text-base md:text-xl text-white/95 mb-8 max-w-2xl mx-auto font-medium">
            Turn your skills and products into <span className="font-bold text-secondary">real income</span>.
            Join <span className="font-bold">200+ verified vendors</span> already earning on campus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary text-white hover:bg-secondary/90 h-12 px-8 font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 group"
            >
              Become a Vendor
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-2 border-white hover:bg-white hover:text-primary h-12 px-8 font-bold backdrop-blur-sm transition-all"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            <div>
              <p className="text-3xl md:text-4xl font-black mb-1">₦45M+</p>
              <p className="text-sm text-white/80">Total Sales Volume</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black mb-1">4.8★</p>
              <p className="text-sm text-white/80">Average Vendor Rating</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black mb-1">5-10%</p>
              <p className="text-sm text-white/80">Low Platform Fee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
