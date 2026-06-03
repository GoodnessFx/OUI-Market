import { ShieldCheck, Truck, BadgeCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Vendors",
    description: "Every vendor is a confirmed OUI student or staff"
  },
  {
    icon: Truck,
    title: "Campus Delivery",
    description: "Get items delivered to your hostel or faculty"
  },
  {
    icon: BadgeCheck,
    title: "Secure Payments",
    description: "Escrow protection on every transaction"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Help center always ready to assist you"
  }
];

export function TrustSection() {
  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
