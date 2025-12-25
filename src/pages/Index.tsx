import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedBooksSection } from "@/components/home/FeaturedBooksSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <WelcomeSection />
        <FeaturedBooksSection />
        <CategoriesSection />
        <NewArrivalsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
