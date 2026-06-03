import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-sm mb-3">About OUIMarket</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline">About Us</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Careers</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Buying</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline">Browse Products</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Browse Services</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Housing</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Jobs</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Campus Feed</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Selling</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline">Become a Vendor</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Vendor Dashboard</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Pricing & Fees</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Vendor Guidelines</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Help & Support</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">How to Buy</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">How to Sell</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Payment Methods</a></li>
              <li><a href="#" className="hover:text-primary hover:underline">Report a Vendor</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Connect With Us</h3>
            <div className="flex gap-3 mb-4">
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              PMB 5533, Ipetumodu<br />
              Osun State, Nigeria<br />
              info@oduduwauniversity.edu.ng
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div className="text-center md:text-left">
              <p className="mb-1">© 2026 OUIMarket • Official Marketplace of Oduduwa University Ipetumodu</p>
              <p>Oduduwa University • Founded 2009 • NUC Licensed Certificate No. 38</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
