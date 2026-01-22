import { Header } from "@/components/layout/Header";
import { HomeFooter } from "@/components/layout/HomeFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { FeaturedBookSpotlight } from "@/components/home/FeaturedBookSpotlight";
import { FeaturedBooksSection } from "@/components/home/FeaturedBooksSection";
import { NewsSection } from "@/components/home/NewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <WelcomeSection />
        <FeaturedBookSpotlight />
        <FeaturedBooksSection />
        <NewsSection />
        <NewsletterSection />
      </main>
      <HomeFooter />
    </div>
  );
};

export default Index;
