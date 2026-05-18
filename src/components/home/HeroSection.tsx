import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPublishedHeroSlides } from "@/services/cmsService";

interface FeaturedReview {
  id: string;
  bookTitle: string;
  author: string;
  quote: string;
  reviewer: string;
  image: string;
  bookId: string;
  linkUrl: string;
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
    fetchPublishedHeroSlides()
      .then((slides) => {
        const mapped: FeaturedReview[] = slides.map((s) => ({
          id: s.id,
          bookTitle: s.title,
          author: s.author || "",
          quote: s.quote || s.subtitle || "",
          reviewer: [s.reviewer_name, s.reviewer_position].filter(Boolean).join(", "),
          image: s.cover_image || "",
          bookId: "",
          linkUrl: s.link_url || "/product",
        }));
        setFeaturedReviews(mapped);
      })
      .catch((err) => console.error("Failed to fetch hero slides:", err))
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
      <div className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-foreground order-2 lg:order-1 min-w-0 min-h-[380px] md:min-h-[420px] flex flex-col justify-center pl-8 sm:pl-12 lg:pl-[max(4rem,calc((100vw-80rem)/2+4rem))] pr-8 sm:pr-12 lg:pr-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-7"
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.p variants={textVariants} transition={{ duration: 0.4 }} className="font-baskerville text-[#e4573d] uppercase tracking-[0.25em] text-lg font-medium mb-3">Featured Review</motion.p>
              <motion.h1 variants={textVariants} transition={{ duration: 0.4, delay: 0.05 }} style={{ fontFamily: "'Libre Baskerville', Georgia, serif", lineHeight: 1.3, color: "#333333", margin: "0 0 20px", letterSpacing: "0.02em" }} className="font-normal text-[40px] break-words">{activeReview.bookTitle}</motion.h1>
                 {activeReview.author && (
                    <motion.p variants={textVariants} transition={{ duration: 0.4, delay: 0.1 }} style={{ fontFamily: "Roboto, system-ui, sans-serif", fontSize: "15px", color: "#333333" }} className="font-bold">By {activeReview.author}</motion.p>
                 )}
                <motion.p variants={textVariants} transition={{ duration: 0.4, delay: 0.15 }} style={{ fontFamily: "Roboto, system-ui, sans-serif", fontSize: "15px", color: "#333333", lineHeight: 1.7 }} className="italic">"{activeReview.quote}"</motion.p>
                <motion.p variants={textVariants} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "Roboto, system-ui, sans-serif", fontSize: "15px", color: "#333333" }} className="font-bold">– {activeReview.reviewer}</motion.p>
                <motion.div variants={textVariants} transition={{ duration: 0.4, delay: 0.25 }} className="pt-2">
                  <Button asChild className="bg-[#e4573d] text-white border border-[#e4573d] hover:bg-transparent hover:text-[#e4573d] px-10 py-3 text-sm tracking-wider font-nav font-bold rounded-none transition-colors" style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif" }}>
                    <Link to={activeReview.linkUrl}>VIEW</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative order-1 lg:order-2 h-[480px] md:h-[600px] lg:h-[760px] flex items-center justify-center lg:justify-start px-4 sm:px-8 lg:pl-0 lg:pr-20 xl:pr-32 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                className="h-full w-full flex items-center justify-center lg:justify-start"
              >
                <img
                  src={activeReview.image}
                  alt={activeReview.bookTitle}
                  className="max-h-full max-w-full w-auto h-full object-contain object-center lg:object-left mx-auto lg:mx-0 scale-110 lg:scale-125 origin-center lg:origin-left"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 md:mt-10 px-8">
          {featuredReviews.map((_, index) => (
            <button key={index} onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }} aria-label={`Go to slide ${index + 1}`} className={cn("w-3 h-3 rounded-full transition-all duration-300 border", activeIndex === index ? "border-accent bg-transparent scale-110" : "border-transparent bg-muted-foreground/30 hover:bg-muted-foreground/50")} />
          ))}
        </div>
      </div>
    </section>
  );
}
