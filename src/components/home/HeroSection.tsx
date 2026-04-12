import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { fetchFeaturedReviews } from "@/services/cspApi";

interface FeaturedReview {
  id: number;
  bookTitle: string;
  quote: string;
  reviewer: string;
  image: string;
  bookId: string;
}

const textVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const imageVariants = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -80, scale: 0.95 },
};

export function HeroSection() {
  const [featuredReviews, setFeaturedReviews] = useState<FeaturedReview[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedReviews()
      .then((data) => {
        const mapped = data.map((item) => {
          const reviewerParts = item.reviewer || "";
          // Fix cover image URL: the featured-reviews API may return ISBN-10 based URLs
          // but S3 bucket uses ISBN-13 format. Try to fix by prepending "978" if needed.
          let coverImage = item.cover_image || "";
          const isbnMatch = coverImage.match(/\/(\d{10})\.jpg$/);
          if (isbnMatch && !coverImage.includes("/978")) {
            coverImage = coverImage.replace(`/${isbnMatch[1]}.jpg`, `/978${isbnMatch[1]}.jpg`);
          }
          return {
            id: item.id,
            bookTitle: item.book_title,
            quote: item.review,
            reviewer: reviewerParts,
            image: coverImage,
            bookId: item.isbn,
          };
        });
        setFeaturedReviews(mapped);
      })
      .catch((err) => console.error("Failed to fetch featured reviews:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || featuredReviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredReviews.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredReviews.length]);

  if (isLoading) {
    return (
      <section className="relative bg-[#f4f3ec] pt-28 pb-8 md:pt-32 md:pb-12 min-h-[60vh] flex items-center">
        <div className="container-wide text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (featuredReviews.length === 0) {
    return (
      <section className="relative bg-[#f4f3ec] pt-28 pb-8 md:pt-32 md:pb-12 min-h-[60vh] flex items-center">
        <div className="container-wide text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-4">
            Welcome
          </h1>
          <p className="text-muted-foreground text-lg">Content coming soon.</p>
        </div>
      </section>
    );
  }

  const activeReview = featuredReviews[activeIndex];
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section
      className="relative bg-[#f4f3ec] pt-28 pb-8 md:pt-32 md:pb-12 min-h-[80vh] flex items-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container-wide relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-foreground order-2 lg:order-1 min-h-[380px] md:min-h-[420px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-7"
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.p variants={textVariants} transition={{ duration: 0.4 }} className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Featured Review</motion.p>
                <motion.h1 variants={textVariants} transition={{ duration: 0.4, delay: 0.05 }} className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-normal leading-[1.65] text-foreground">{activeReview.bookTitle}</motion.h1>
                <motion.p variants={textVariants} transition={{ duration: 0.4, delay: 0.15 }} className="text-muted-foreground text-sm md:text-base italic leading-relaxed">"{activeReview.quote}"</motion.p>
                <motion.p variants={textVariants} transition={{ duration: 0.4, delay: 0.2 }} className="text-foreground text-sm font-semibold">– {activeReview.reviewer}</motion.p>
                <motion.div variants={textVariants} transition={{ duration: 0.4, delay: 0.25 }} className="pt-2">
                  <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-3 text-sm tracking-wider">
                    <Link to={`/books/${activeReview.bookId}`}>VIEW</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative order-1 lg:order-2 h-[350px] md:h-[440px] lg:h-[540px] lg:-mr-32">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} variants={imageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }} className="absolute inset-0 flex items-center justify-end">
                <img src={activeReview.image} alt={activeReview.bookTitle} className="h-full w-auto max-w-none object-contain mix-blend-multiply drop-shadow-2xl" style={{ filter: "drop-shadow(8px 12px 20px rgba(0,0,0,0.15))" }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 md:mt-10">
          {featuredReviews.map((_, index) => (
            <button key={index} onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }} aria-label={`Go to slide ${index + 1}`} className={cn("w-2.5 h-2.5 rounded-full transition-all duration-300", activeIndex === index ? "bg-accent scale-110" : "bg-muted-foreground/25 hover:bg-muted-foreground/40")} />
          ))}
        </div>
      </div>
    </section>
  );
}
