import { Star, BadgeCheck, Package } from "lucide-react";

const vendors = [
  {
    id: 1,
    name: "Mama's Kitchen",
    category: "Food & Catering",
    rating: 4.9,
    reviews: 234,
    products: 45,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200&h=200&fit=crop",
    verified: true
  },
  {
    id: 2,
    name: "TechHub OUI",
    category: "Electronics",
    rating: 4.8,
    reviews: 156,
    products: 68,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop",
    verified: true
  },
  {
    id: 3,
    name: "Style by Shade",
    category: "Fashion",
    rating: 4.9,
    reviews: 189,
    products: 92,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
    verified: true
  },
  {
    id: 4,
    name: "Campus Books",
    category: "Stationery",
    rating: 4.7,
    reviews: 167,
    products: 120,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop",
    verified: true
  },
  {
    id: 5,
    name: "Fresh Cuts",
    category: "Beauty & Grooming",
    rating: 4.8,
    reviews: 143,
    products: 12,
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop",
    verified: true
  },
  {
    id: 6,
    name: "Code Craft",
    category: "Services",
    rating: 5.0,
    reviews: 92,
    products: 8,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop",
    verified: true
  }
];

export function TopVendors() {
  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Top Vendors</h2>
          <button className="text-primary hover:underline text-sm font-medium">SEE ALL</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="cursor-pointer bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted/30 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-1">
                    <span className="truncate">{vendor.name}</span>
                    {vendor.verified && (
                      <BadgeCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{vendor.category}</p>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="font-medium">{vendor.rating}</span>
                  <span className="text-muted-foreground">({vendor.reviews})</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
                  <Package className="h-3 w-3" />
                  <span>{vendor.products} products</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
