import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, ShoppingCart, Filter, Search, ArrowLeft, Grid, List, CreditCard, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ProductDetailModal } from "./ProductDetailModal";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Fresh Jollof Rice & Chicken - Large Portion",
    vendor: "Mama's Kitchen",
    price: 1500,
    category: "Food",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=450&fit=crop",
    verified: true,
  },
  {
    id: 2,
    name: "Apple AirPods Pro 2nd Gen - Sealed",
    vendor: "TechHub OUI",
    price: 185000,
    category: "Electronics",
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=450&fit=crop",
    verified: true,
  },
  {
    id: 3,
    name: "Designer University Hoodie - OUI Custom",
    vendor: "Fashion Hub",
    price: 8500,
    category: "Fashion",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=450&fit=crop",
    verified: true,
  },
  {
    id: 4,
    name: "Engineering Textbook Bundle - 200 Level",
    vendor: "Campus Books",
    price: 12000,
    category: "Services",
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=450&fit=crop",
    verified: true,
  },
  {
    id: 5,
    name: "Nike Air Force 1 - White (Original)",
    vendor: "Kicks & More",
    price: 55000,
    category: "Fashion",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=450&fit=crop",
    verified: true,
  },
  {
    id: 6,
    name: "JBL Bluetooth Speaker - Waterproof",
    vendor: "Campus Electronics",
    price: 28000,
    category: "Electronics",
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=450&fit=crop",
    verified: true,
  },
  {
    id: 7,
    name: "Student Laptop Desk - Portable",
    vendor: "Campus Furniture",
    price: 7500,
    category: "Electronics",
    rating: 4.5,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=450&fit=crop",
    verified: false,
  },
  {
    id: 8,
    name: "Graphic Design Service - Logos & Posters",
    vendor: "Creative Studio",
    price: 5000,
    category: "Services",
    rating: 5.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bde2?w=600&h=450&fit=crop",
    verified: true,
  }
];

export function ProductListing({ category = "All" }: { category?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredProducts = ALL_PRODUCTS.filter(p => {
    const matchesCategory = category === "All" || p.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDetail = (product: any) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={() => window.location.hash = "#/"}
              className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-black uppercase tracking-widest mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter">
              {category === "All" ? "Everything on Campus" : `${category} Collection`}
            </h1>
            <p className="text-slate-500 font-medium">Showing {filteredProducts.length} verified listings</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white border-2 border-slate-100 rounded-2xl focus-visible:ring-primary shadow-sm"
              />
            </div>
            <div className="flex bg-white p-1 rounded-xl border-2 border-slate-100 shadow-sm">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <CardContent className="p-6 space-y-8">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {["All", "Electronics", "Fashion", "Food", "Services"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => window.location.hash = `#/products/${cat.toLowerCase()}`}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                          (category === "All" && cat === "All") || category.toLowerCase() === cat.toLowerCase()
                            ? "bg-primary/10 text-primary"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Min" className="h-11 rounded-xl bg-slate-50/50" />
                      <Input placeholder="Max" className="h-11 rounded-xl bg-slate-50/50" />
                    </div>
                    <Button className="w-full h-11 bg-[#0F172A] text-white font-black rounded-xl">Apply Filter</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleOpenDetail(product)}
                    className={`group cursor-pointer bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                      viewMode === "list" ? "flex flex-col md:flex-row md:items-center" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "md:w-64 aspect-square" : "aspect-[4/3]"}`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-[#0F172A] border-none font-black text-[10px] px-3 py-1 shadow-lg uppercase tracking-widest">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <div className="p-6 flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{product.vendor}</p>
                          {product.verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                        </div>
                        <h3 className="text-lg font-black text-[#0F172A] leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-primary">₦{product.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-black">{product.rating}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full h-12 bg-[#0F172A] hover:bg-primary text-white font-black rounded-2xl shadow-lg transition-all group-hover:scale-[1.02] active:scale-95"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Quick Buy
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-[#0F172A] mb-2">No products found</h3>
                <p className="text-slate-500 font-medium">Try searching for something else or check another category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal 
          product={{...selectedProduct, reviews: 0, inStock: true}}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
}
