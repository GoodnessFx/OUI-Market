import { Clock, Flame, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const deals = [
  {
    id: 1,
    name: "Anker Power Bank 20000mAh - Fast Charge",
    price: 8500,
    originalPrice: 15000,
    discount: 43,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop",
    stock: 12,
    maxStock: 20
  },
  {
    id: 2,
    name: "LED Study Desk Lamp - Adjustable",
    price: 3500,
    originalPrice: 6000,
    discount: 42,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
    stock: 8,
    maxStock: 15
  },
  {
    id: 3,
    name: "Premium Notebook Set (5pcs) - A4 Size",
    price: 2000,
    originalPrice: 3500,
    discount: 43,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=300&fit=crop",
    stock: 15,
    maxStock: 25
  },
  {
    id: 4,
    name: "USB-C 3-in-1 Fast Charging Cable 2M",
    price: 1200,
    originalPrice: 2500,
    discount: 52,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop",
    stock: 20,
    maxStock: 30
  },
  {
    id: 5,
    name: "Adjustable Phone Holder Stand - Aluminum",
    price: 1800,
    originalPrice: 3000,
    discount: 40,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=300&h=300&fit=crop",
    stock: 6,
    maxStock: 12
  },
  {
    id: 6,
    name: "Insulated Water Bottle 1L - BPA Free",
    price: 2500,
    originalPrice: 4000,
    discount: 38,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
    stock: 10,
    maxStock: 20
  }
];

export function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-secondary/5 to-orange-50/50 border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                Flash Sales
              </h2>
              <p className="text-xs text-muted-foreground font-semibold">Limited time deals - Grab them fast!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-xs font-semibold text-muted-foreground">Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-bold">
                <div className="bg-secondary text-white px-2.5 py-1 rounded text-sm shadow-sm">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-secondary">:</span>
                <div className="bg-secondary text-white px-2.5 py-1 rounded text-sm shadow-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-secondary">:</span>
                <div className="bg-secondary text-white px-2.5 py-1 rounded text-sm shadow-sm animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
            <button className="text-primary hover:underline text-sm font-bold transition-colors">
              SEE ALL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {deals.map((deal, idx) => (
            <div
              key={deal.id}
              className="group cursor-pointer bg-white border-2 border-transparent hover:border-secondary rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-square bg-muted/30 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-secondary to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  -{deal.discount}%
                </div>
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                  HOT
                </div>
              </div>

              <div className="p-3 space-y-2">
                <h3 className="text-sm font-bold line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-secondary transition-colors">
                  {deal.name}
                </h3>

                <div className="space-y-1">
                  <div className="text-lg font-black text-secondary">₦{deal.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground line-through font-semibold">
                    ₦{deal.originalPrice.toLocaleString()}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-semibold">Stock</span>
                    <span className="font-bold text-secondary">{deal.stock} left!</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-secondary to-orange-500 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${(deal.stock / deal.maxStock) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
