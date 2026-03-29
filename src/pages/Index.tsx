import { Header } from "@/components/layout/Header";
import { HomeFooter } from "@/components/layout/HomeFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { FeaturedBooksSection } from "@/components/home/FeaturedBooksSection";
import { NewsSection } from "@/components/home/NewsSection";
import { AuthorReviewsSection } from "@/components/home/AuthorReviewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { StatsCounterSection } from "@/components/home/StatsCounterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f4f3ec]">
      <Header />
      <main>
        {/* 1. Featured Reviews Carousel */}
        <HeroSection />
        {/* 2. Welcome / Logo section with 3 CTAs */}
        <WelcomeSection />
        {/* 3. Featured Books (Forthcoming Titles) */}
        <FeaturedBooksSection />
        {/* 4. Author Reviews */}
        <AuthorReviewsSection />
        {/* 5. News preview */}
        <NewsSection />
        {/* 6. Sign Up for Mailing List */}
        <NewsletterSection />
        {/* 7. Statistics */}
        <StatsCounterSection />
      </main>
      <HomeFooter />
    </div>
  );
};

export default Index;
