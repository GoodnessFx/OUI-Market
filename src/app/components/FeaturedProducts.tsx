import { Star, BadgeCheck, ShoppingCart, CreditCard, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ProductDetailModal } from "./ProductDetailModal";

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
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              Featured <span className="text-primary">Campus Deals</span>
            </h2>
            <p className="text-slate-500 font-medium">Top-rated items from verified campus vendors</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => window.location.hash = "#/all-products"}
            className="font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5"
          >
            View All Products
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white rounded-[2rem] border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full cursor-pointer"
              onClick={() => handleOpenDetail(product)}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black shadow-lg">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[80px]">
                    {product.vendor}
                  </span>
                  {product.verified && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                </div>
                
                <h3 className="font-bold text-sm text-[#0F172A] leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <div className="mt-auto">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black">{product.rating}</span>
                    <span className="text-[9px] text-slate-400 font-bold ml-1">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-black text-[#0F172A]">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <Button 
                      size="icon"
                      className="h-9 w-9 rounded-xl bg-slate-100 text-slate-900 hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </section>
  );
}
