import { Star, BadgeCheck, Heart } from "lucide-react";
import { useState } from "react";

const fashionItems = [
  {
    id: 1,
    name: "OUI Custom Hoodie - Forest Green",
    vendor: "Campus Streetwear",
    price: 8500,
    originalPrice: 12000,
    rating: 4.9,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    discount: 29,
    verified: true,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Women's Ankara Gown - Premium Fabric",
    vendor: "Shade's Fashion Hub",
    price: 15000,
    originalPrice: 20000,
    rating: 5.0,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1596783838652-37b5c90f1f90?w=400&h=500&fit=crop",
    discount: 25,
    verified: true,
    sizes: ["S", "M", "L"]
  },
  {
    id: 3,
    name: "Men's Denim Jacket - Slim Fit",
    vendor: "Urban Style OUI",
    price: 12000,
    originalPrice: 18000,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400&h=500&fit=crop",
    discount: 33,
    verified: true,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Corporate Shirt - White Premium Cotton",
    vendor: "Executive Wears",
    price: 6500,
    rating: 4.7,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    verified: true,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Women's Bodycon Dress - Black",
    vendor: "Glam Boutique OUI",
    price: 9500,
    originalPrice: 14000,
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    discount: 32,
    verified: true,
    sizes: ["S", "M", "L"]
  },
  {
    id: 6,
    name: "Sneakers - Classic White Low Top",
    vendor: "Kicks & More",
    price: 18000,
    originalPrice: 25000,
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    discount: 28,
    verified: true,
    sizes: ["40", "41", "42", "43", "44"]
  }
];

export function FashionSection() {
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLiked(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white border-b" id="fashion">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Fashion & Clothing</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Style up your campus look</p>
          </div>
          <button className="text-primary hover:underline text-sm font-semibold transition-colors">
            SEE ALL
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {fashionItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[3/4] bg-muted/30 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.discount && (
                  <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    -{item.discount}%
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(item.id);
                  }}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all active:scale-90"
                >
                  <Heart
                    className={`h-4 w-4 transition-all ${
                      liked.includes(item.id)
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 space-y-2">
                <h3 className="text-sm font-semibold line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors">
                  {item.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="truncate">{item.vendor}</span>
                  {item.verified && (
                    <BadgeCheck className="h-3 w-3 text-primary flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="font-semibold">{item.rating}</span>
                  <span className="text-muted-foreground">({item.reviews})</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-lg font-bold text-primary">
                    ₦{item.price.toLocaleString()}
                  </div>
                  {item.originalPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                      ₦{item.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t">
                  {item.sizes.slice(0, 4).map((size) => (
                    <span
                      key={size}
                      className="px-2 py-0.5 text-[10px] font-medium bg-muted rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
