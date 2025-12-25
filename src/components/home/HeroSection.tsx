import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Featured reviews similar to Cambridge Scholars
const featuredReviews = [
  {
    id: 1,
    label: "Featured Review",
    bookTitle: "Fundamentals of Human Ecology",
    subtitle: "A Paradigm for a More Sustainable Economy",
    author: "By Nuria Chinchilla Albiol and Pilar García Lombardía",
    quote:
      "An invaluable gem as a guide to the human condition, which is so lost and without reference points in today's world.",
    reviewer: "Isabel Tocino",
    reviewerTitle:
      "Vice President of the Board of Directors of Banco Santander, former Minister of the Environment of Spain",
    image:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/fundamental-mockup-1-scaled.png",
    bookId: "1",
  },
  {
    id: 2,
    label: "Featured Review",
    bookTitle: "Instinct, Tradition and Reason",
    subtitle: "The Moral Philosophy of F.A. Hayek",
    author: "By Jules Goddard",
    quote:
      "This remarkable book traces how human morality has evolved, using the insights of F.A. Hayek. At the same time, it looks ahead to a future where AI may shape—and be shaped by—its own forms of moral reasoning. It offers a powerful reminder that our ethical frameworks may soon need to change. Thoughtful, timely, and deeply relevant.",
    reviewer: "François Ortalo-Magné",
    reviewerTitle: "Dean & CEO, 2017-2024, London Business School, UK",
    image:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/Instinct-mockup-scaled.png",
    bookId: "2",
  },
  {
    id: 3,
    label: "Featured Review",
    bookTitle: "Caribbean Men in the Arts",
    subtitle: "Demystifying Masculinities with Essays, Interviews, Poetry and Stories",
    author: "By Keino Senior and Opal Palmer Adisa",
    quote:
      "From every angle and through many genres, Opal Palmer Adisa and Keino Senior, explore masculinity and manhood throughout the Caribbean. This collection of essays, poems and artists' statements makes this the first anthology of its kind. It is impossible to read this book without learning a little more about yourself, whether you are man, woman, or nonbinary!",
    reviewer: "Jericho Brown",
    reviewerTitle: "Pulitzer Prize Winner for 'The Tradition'",
    image:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/carribean-mockup-scaled.png",
    bookId: "3",
  },
  {
    id: 4,
    label: "Featured Review",
    bookTitle: "Rescuing the Social Function of the Economy",
    subtitle: "Brazil is Back",
    author: "By Ladislau Dowbor",
    quote:
      "With special focus on Brazil, this lucid study offers concrete guidelines for escape from the tragedy of hunger in the midst of plenty, underused resources, idle hands with so much work that should be done to benefit the larger society, while the global economy regresses from creating capital for production to bestowing wealth on a few – all the result of policies that can be reversed by an informed and engaged public. A most valuable contribution in these troubled times.",
    reviewer: "Noam Chomsky",
    reviewerTitle: "Massachusetts Institute of Technology, USA",
    image:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/unnamed-1-scaled.png",
    bookId: "4",
  },
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeReview = featuredReviews[activeIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredReviews.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % featuredReviews.length);
  };

  return (
    <section className="relative bg-[#f4f3ec] pt-28 pb-12 md:pt-32 md:pb-16 min-h-[85vh] flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-foreground space-y-5 order-2 lg:order-1">
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.2em]">
              {activeReview.label}
            </span>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] text-balance text-primary">
              {activeReview.bookTitle}
            </h1>

            {activeReview.subtitle && (
              <h2 className="text-lg md:text-xl lg:text-2xl text-muted-foreground italic font-serif">
                {activeReview.subtitle}
              </h2>
            )}

            <p className="text-muted-foreground text-sm md:text-base">{activeReview.author}</p>

            {/* Quote */}
            <blockquote className="relative py-4">
              <p className="text-base md:text-lg italic text-foreground/90 leading-relaxed">
                <span className="text-accent text-2xl font-serif">"</span>
                {activeReview.quote}
                <span className="text-accent text-2xl font-serif">"</span>
              </p>
              <footer className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">– {activeReview.reviewer}</span>
                <span className="block text-xs mt-1">{activeReview.reviewerTitle}</span>
              </footer>
            </blockquote>

            <div className="pt-2">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6">
                <Link to={`/books/${activeReview.bookId}`}>View</Link>
              </Button>
            </div>
          </div>

          {/* Book Image - Mockup style */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <img
                src={activeReview.image}
                alt={activeReview.bookTitle}
                className="w-full h-auto object-contain transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8 md:mt-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="rounded-full border border-border text-foreground hover:bg-muted h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {featuredReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(index);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeIndex === index ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="rounded-full border border-border text-foreground hover:bg-muted h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
