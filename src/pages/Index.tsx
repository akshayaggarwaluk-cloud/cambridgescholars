import { Header } from "@/components/layout/Header";
import { HomeFooter } from "@/components/layout/HomeFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { FeaturedBooksSection } from "@/components/home/FeaturedBooksSection";
import { NewsSection } from "@/components/home/NewsSection";
import { AuthorReviewsSection } from "@/components/home/AuthorReviewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f4f3ec]">
      <Header />
      <main>
        <HeroSection />
        <WelcomeSection />
        <FeaturedBooksSection />
        <AuthorReviewsSection />
        <NewsSection />
        <NewsletterSection />
      </main>
      <HomeFooter />
    </div>
  );
};

export default Index;
