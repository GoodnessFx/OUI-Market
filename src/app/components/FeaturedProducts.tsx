import { Star, BadgeCheck, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";

const products = [
  {
    id: 1,
    name: "Fresh Jollof Rice & Chicken - Large Portion",
    vendor: "Mama's Kitchen",
    price: 1500,
    originalPrice: 2000,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    discount: 25,
    verified: true,
    inStock: true
  },
  {
    id: 2,
    name: "Apple AirPods Pro 2nd Gen - Sealed",
    vendor: "TechHub OUI",
    price: 185000,
    originalPrice: 220000,
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop",
    discount: 16,
    verified: true,
    inStock: true
  },
  {
    id: 3,
    name: "Samsung Galaxy Buds - Crystal Clear Audio",
    vendor: "Audio Plus",
    price: 45000,
    originalPrice: 65000,
    rating: 4.7,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
    discount: 31,
    verified: true,
    inStock: true
  },
  {
    id: 4,
    name: "Engineering Textbook Bundle - 200 Level",
    vendor: "Campus Books",
    price: 12000,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    verified: true,
    inStock: true
  },
  {
    id: 5,
    name: "Nike Air Force 1 - White (Original)",
    vendor: "Kicks & More",
    price: 55000,
    originalPrice: 75000,
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    discount: 27,
    verified: true,
    inStock: true
  },
  {
    id: 6,
    name: "JBL Bluetooth Speaker - Waterproof",
    vendor: "Campus Electronics",
    price: 28000,
    originalPrice: 40000,
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    discount: 30,
    verified: true,
    inStock: true
  }
];

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleBuyNow = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsPaymentOpen(true);
  };

  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              Featured <span className="text-primary">Campus Deals</span>
            </h2>
            <p className="text-sm text-muted-foreground font-bold mt-1">Best selling products from verified student vendors</p>
          </div>
          <button className="bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-black hover:bg-primary hover:text-white transition-all">
            VIEW ALL PRODUCTS
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer bg-white border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-square bg-muted/30 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.discount && (
                  <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                    -{product.discount}% OFF
                  </div>
                )}
                {product.inStock && (
                  <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                    Verified Stock
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-sm font-black line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <div className="space-y-1">
                  <div className="text-xl font-black text-primary">₦{product.price.toLocaleString()}</div>
                  {product.originalPrice && (
                    <div className="text-xs text-muted-foreground line-through font-bold">
                      ₦{product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px]">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? "fill-secondary text-secondary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground font-bold">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                  <span className="truncate">{product.vendor}</span>
                  {product.verified && (
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg transition-all active:scale-95"
                  onClick={() => handleBuyNow(product)}
                >
                  <CreditCard className="h-3.5 w-3.5 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          amount={`₦${selectedProduct.price.toLocaleString()}`}
          itemName={selectedProduct.name}
        />
      )}
    </section>
  );
}
