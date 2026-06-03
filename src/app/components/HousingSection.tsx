import { MapPin, BadgeCheck, Phone, BedDouble, Bath, Wifi, Zap, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";

const housingListings = [
  {
    id: 1,
    title: "Modern Self-Contained Apartment",
    landlord: "Mr. Ademola Ogunleye",
    phone: "+234 803 456 7890",
    price: 120000,
    priceType: "per semester",
    caution: 50000,
    location: "5 mins walk from OUI Gate",
    area: "Ipetumodu",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=350&fit=crop",
    verified: true,
    rating: 4.8,
    reviews: 23,
    amenities: ["Electricity", "Water", "WiFi", "Private Bathroom"],
    features: [
      { icon: BedDouble, label: "Self-Contained" },
      { icon: Bath, label: "Private Bath" },
      { icon: Wifi, label: "WiFi Ready" },
      { icon: Zap, label: "Prepaid Meter" }
    ]
  },
  {
    id: 2,
    title: "Room in Shared Flat (3 Bedroom)",
    landlord: "Mrs. Blessing Adeyemi",
    phone: "+234 805 123 4567",
    price: 80000,
    priceType: "per semester",
    caution: 30000,
    location: "10 mins walk from school",
    area: "Ipetumodu Junction",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=350&fit=crop",
    verified: true,
    rating: 4.6,
    reviews: 18,
    amenities: ["Electricity", "Water", "Kitchen", "Shared Toilet"],
    features: [
      { icon: BedDouble, label: "Shared Flat" },
      { icon: Bath, label: "Shared Bath" },
      { icon: Zap, label: "Postpaid Meter" }
    ]
  },
  {
    id: 3,
    title: "Luxury Bedsitter - Fully Furnished",
    landlord: "Engr. Tunde Bakare",
    phone: "+234 806 789 0123",
    price: 150000,
    priceType: "per semester",
    caution: 60000,
    location: "3 mins from campus gate",
    area: "OUI Main Road",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=350&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 31,
    amenities: ["Electricity", "Water", "WiFi", "AC", "Furnished"],
    features: [
      { icon: BedDouble, label: "Bedsitter" },
      { icon: Bath, label: "Private Bath" },
      { icon: Wifi, label: "Fast WiFi" },
      { icon: Zap, label: "Backup Gen" }
    ],
    featured: true
  },
  {
    id: 4,
    title: "Single Room (Face-me-I-face-you)",
    landlord: "Alhaji Mustapha Ibrahim",
    phone: "+234 807 234 5678",
    price: 55000,
    priceType: "per semester",
    caution: 20000,
    location: "8 mins walk from OUI",
    area: "Ipetumodu Town",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=350&fit=crop",
    verified: true,
    rating: 4.4,
    reviews: 12,
    amenities: ["Electricity", "Water", "Shared Kitchen", "Shared Toilet"],
    features: [
      { icon: BedDouble, label: "Single Room" },
      { icon: Bath, label: "Shared Bath" }
    ]
  },
  {
    id: 5,
    title: "Duplex - 2 Bedroom (Suitable for 4)",
    landlord: "Dr. Funmilayo Ojo",
    phone: "+234 808 345 6789",
    price: 250000,
    priceType: "per semester",
    caution: 100000,
    location: "4 mins drive from campus",
    area: "Ile-Ife Road",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=350&fit=crop",
    verified: true,
    rating: 5.0,
    reviews: 8,
    amenities: ["Electricity", "Water", "WiFi", "Parking", "Security", "Generator"],
    features: [
      { icon: BedDouble, label: "2 Bedroom" },
      { icon: Bath, label: "2 Bathrooms" },
      { icon: Wifi, label: "WiFi" },
      { icon: Zap, label: "Gen Backup" }
    ],
    featured: true
  },
  {
    id: 6,
    title: "Hostel Bunk - Boys Hostel",
    landlord: "OUI Hostel Management",
    phone: "+234 809 456 7890",
    price: 45000,
    priceType: "per semester",
    caution: 15000,
    location: "On campus (Near Faculty of Engineering)",
    area: "OUI Campus",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=350&fit=crop",
    verified: true,
    rating: 4.3,
    reviews: 45,
    amenities: ["Electricity", "Water", "Security", "Common Room"],
    features: [
      { icon: BedDouble, label: "Bunk Bed" },
      { icon: Bath, label: "Shared Bath" }
    ]
  }
];

export function HousingSection() {
  return (
    <section className="bg-muted/30 border-b" id="housing">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Campus Housing</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Find your perfect accommodation near OUI</p>
          </div>
          <button className="text-primary hover:underline text-sm font-semibold transition-colors">
            SEE ALL LISTINGS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {housingListings.map((listing) => (
            <div
              key={listing.id}
              className="group cursor-pointer bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {listing.featured && (
                  <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                    FEATURED
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded shadow-sm">
                  <div className="text-xs font-semibold text-muted-foreground">From</div>
                  <div className="text-sm font-bold text-primary">₦{listing.price.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">{listing.priceType}</div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>

                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{listing.area}</p>
                      <p>{listing.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${listing.id}`} alt={listing.landlord} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold flex items-center gap-1">
                        {listing.landlord}
                        {listing.verified && (
                          <BadgeCheck className="h-3 w-3 text-primary flex-shrink-0" />
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Verified Landlord</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {listing.features.map((feature, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded bg-muted/30">
                      <feature.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[9px] font-medium text-center leading-tight">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Caution: ₦{listing.caution.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{listing.rating}</span>
                    <span>({listing.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
