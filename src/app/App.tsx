import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Categories } from "./components/Categories";
import { FlashDeals } from "./components/FlashDeals";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { FashionSection } from "./components/FashionSection";
import { FeaturedServices } from "./components/FeaturedServices";
import { HousingSection } from "./components/HousingSection";
import { TrustSection } from "./components/TrustSection";
import { TopVendors } from "./components/TopVendors";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { SplashScreen } from "./components/SplashScreen";
import { CookieConsent } from "./components/CookieConsent";
import { SupportChat } from "./components/SupportChat";
import { VendorPortal } from "./components/VendorPortal";
import { JobMarketplace } from "./components/JobMarketplace";
import { ChatSystem } from "./components/ChatSystem";
import { ProductListing } from "./components/ProductListing";
import { HelpCenter } from "./components/HelpCenter";
import { UserDashboard } from "./components/UserDashboard";
import { ReportIssue } from "./components/ReportIssue";
import { useState, useEffect } from "react";
import { useStore } from "./components/utils/store";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.hash || "#/");
  const setSupportOpen = useStore((state) => state.setSupportOpen);

  // Expose store to window for global access (needed for HelpCenter)
  useEffect(() => {
    (window as any).useStore = { getState: () => ({ setSupportOpen }) };
  }, [setSupportOpen]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || "#/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentPath.startsWith("#/products/")) {
      const category = currentPath.split("/").pop();
      return <ProductListing category={category} />;
    }
    if (currentPath === "#/all-products") {
      return <ProductListing category="All" />;
    }

    switch (currentPath) {
      case "#/vendor":
        return <VendorPortal />;
      case "#/jobs":
        return <JobMarketplace />;
      case "#/chat":
        return <ChatSystem />;
      case "#/help":
        return <HelpCenter />;
      case "#/report":
        return <ReportIssue />;
      case "#/account":
        return <UserDashboard view="profile" />;
      case "#/notifications":
        return <UserDashboard view="notifications" />;
      case "#/wallet":
        return <UserDashboard view="wallet" />;
      case "#/orders":
        return <UserDashboard view="orders" />;
      case "#/settings":
        return <UserDashboard view="settings" />;
      default:
        return (
          <>
            <Hero />
            <Categories />
            <FlashDeals />
            <FeaturedProducts />
            <FashionSection />
            <FeaturedServices />
            <HousingSection />
            <TrustSection />
            <TopVendors />
            <CallToAction />
          </>
        );
    }
  };

  return (
    <>
      <SplashScreen onFinish={() => setLoading(false)} />
      
      {!loading && (
        <div className="min-h-screen flex flex-col bg-white animate-in fade-in duration-300">
          <Header />
          <main className="flex-1">
            {renderContent()}
          </main>
          <Footer />
          <CookieConsent />
          <SupportChat />
        </div>
      )}
    </>
  );
}