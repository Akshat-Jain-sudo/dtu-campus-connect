import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global background mesh */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <div className="section-divider" />
        <CategoriesSection />
        <div className="section-divider" />
        <FeaturedListings />
        <div className="section-divider" />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
