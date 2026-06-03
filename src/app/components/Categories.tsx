import {
  ShoppingBag,
  Utensils,
  Laptop,
  BookOpen,
  Palette,
  Briefcase,
  Camera,
  Sparkles,
  Home,
  Wrench
} from "lucide-react";

const categories = [
  { icon: Utensils, name: "Food & Drinks", color: "text-orange-600", bg: "bg-orange-50", hover: "hover:bg-orange-100", link: "#/products/food" },
  { icon: ShoppingBag, name: "Fashion", color: "text-pink-600", bg: "bg-pink-50", hover: "hover:bg-pink-100", link: "#/products/fashion" },
  { icon: Laptop, name: "Electronics", color: "text-blue-600", bg: "bg-blue-50", hover: "hover:bg-blue-100", link: "#/products/electronics" },
  { icon: BookOpen, name: "Books", color: "text-indigo-600", bg: "bg-indigo-50", hover: "hover:bg-indigo-100", link: "#/products/books" },
  { icon: Palette, name: "Design", color: "text-purple-600", bg: "bg-purple-50", hover: "hover:bg-purple-100", link: "#/products/services" },
  { icon: Briefcase, name: "Jobs", color: "text-green-600", bg: "bg-green-50", hover: "hover:bg-green-100", link: "#/jobs" },
  { icon: Home, name: "Housing", color: "text-cyan-600", bg: "bg-cyan-50", hover: "hover:bg-cyan-100", link: "#/housing" },
  { icon: Wrench, name: "Services", color: "text-amber-600", bg: "bg-amber-50", hover: "hover:bg-amber-100", link: "#/products/services" },
  { icon: Camera, name: "Photo/Video", color: "text-teal-600", bg: "bg-teal-50", hover: "hover:bg-teal-100", link: "#/products/services" },
  { icon: Sparkles, name: "Beauty", color: "text-rose-600", bg: "bg-rose-50", hover: "hover:bg-rose-100", link: "#/products/beauty" },
];

export function Categories() {
  return (
    <section className="bg-white border-b sticky top-[144px] z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((category, idx) => (
            <a
              key={category.name}
              href={category.link}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[80px] ${category.hover} transition-all group cursor-pointer animate-in slide-in-from-bottom duration-300`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`h-12 w-12 rounded-full ${category.bg} flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform shadow-sm`}>
                <category.icon className={`h-5 w-5 ${category.color}`} />
              </div>
              <span className="text-xs text-center font-semibold whitespace-nowrap group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
