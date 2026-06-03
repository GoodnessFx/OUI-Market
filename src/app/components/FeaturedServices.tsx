import { Star, BadgeCheck, Clock } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Professional Logo Design",
    vendor: "Tunde Graphics",
    college: "CMSS",
    price: 5000,
    rating: 4.9,
    reviews: 156,
    deliveryTime: "2 days",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
    verified: true
  },
  {
    id: 2,
    title: "Mathematics Tutoring (100-200 Level)",
    vendor: "Sarah Emmanuel",
    college: "Natural Sciences",
    price: 2500,
    rating: 5.0,
    reviews: 98,
    deliveryTime: "1 hour",
    image: "https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=400&h=300&fit=crop",
    verified: true
  },
  {
    id: 3,
    title: "Event Photography & Videography",
    vendor: "Lens Studio OUI",
    college: "Engineering",
    price: 15000,
    rating: 4.8,
    reviews: 73,
    deliveryTime: "Same day",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
    verified: true
  },
  {
    id: 4,
    title: "Custom Website Development",
    vendor: "Code Craft",
    college: "Engineering",
    price: 45000,
    rating: 4.9,
    reviews: 62,
    deliveryTime: "7 days",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    verified: true
  },
  {
    id: 5,
    title: "Video Editing & Post Production",
    vendor: "Creative Edge",
    college: "CMSS",
    price: 8000,
    rating: 4.7,
    reviews: 84,
    deliveryTime: "3 days",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
    verified: true
  },
  {
    id: 6,
    title: "Social Media Management",
    vendor: "Digital Maven",
    college: "CMSS",
    price: 12000,
    rating: 4.8,
    reviews: 67,
    deliveryTime: "Ongoing",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
    verified: true
  }
];

export function FeaturedServices() {
  return (
    <section className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Top Services</h2>
          <button className="text-primary hover:underline text-sm font-medium">SEE ALL</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {services.map((service) => (
            <div key={service.id} className="group cursor-pointer bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-muted/30">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 space-y-2">
                <h3 className="text-sm font-medium line-clamp-2 leading-tight min-h-[2.5rem]">
                  {service.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="truncate">{service.vendor}</span>
                  {service.verified && (
                    <BadgeCheck className="h-3 w-3 text-primary flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviews})</span>
                </div>

                <div className="pt-1 border-t">
                  <div className="text-xs text-muted-foreground mb-0.5">From</div>
                  <div className="text-base font-bold">₦{service.price.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{service.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
