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

const BOOK_THICKNESS = 30;

// Renders a flat cover image as a 3D book leaning back and turned clockwise,
// with page edges on the right and bottom and a shadow cast behind it.
function Book3D({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[72%]" style={{ perspective: "1600px" }}>
      <div
        className="relative h-full"
        style={{ transformStyle: "preserve-3d", transform: "rotateZ(12deg) rotateX(15deg) rotateY(-14deg)" }}
      >
        {/* Shadow cast behind the book */}
        <div
          className="absolute inset-0 rounded-[4px] bg-black/45 blur-2xl"
          style={{ transform: `translateZ(${-BOOK_THICKNESS / 2 - 2}px) translate(10%, 6%)` }}
          aria-hidden
        />
        <img
          src={src}
          alt={alt}
          className="pointer-events-none relative block h-full w-auto max-w-none rounded-r-[3px]"
          style={{ transform: `translateZ(${BOOK_THICKNESS / 2}px)` }}
        />
        {/* Spine crease and light falloff on the front cover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-r-[3px]"
          style={{
            transform: `translateZ(${BOOK_THICKNESS / 2 + 0.5}px)`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 3%, rgba(255,255,255,0.1) 5%, transparent 9%), linear-gradient(160deg, rgba(255,255,255,0.12), transparent 45%, rgba(0,0,0,0.12))",
          }}
          aria-hidden
        />
        {/* Page block, right edge */}
        <div
          className="absolute right-0 top-[1%] h-[98%]"
          style={{
            width: `${BOOK_THICKNESS}px`,
            transformOrigin: "right center",
            transform: `translateZ(${-BOOK_THICKNESS / 2}px) rotateY(90deg)`,
            background: "repeating-linear-gradient(90deg, #fbfaf4 0px, #dedbd0 1px, #fbfaf4 2px)",
          }}
          aria-hidden
        />
        {/* Page block, bottom edge */}
        <div
          className="absolute bottom-0 left-[1%] w-[98%]"
          style={{
            height: `${BOOK_THICKNESS}px`,
            transformOrigin: "center bottom",
            transform: `translateZ(${BOOK_THICKNESS / 2}px) rotateX(90deg)`,
            background: "repeating-linear-gradient(180deg, #f1efe6 0px, #d2cfc3 1px, #f1efe6 2px)",
          }}
          aria-hidden
        />
        {/* Back cover */}
        <div
          className="absolute inset-0 rounded-r-[3px] bg-neutral-800"
          style={{ transform: `translateZ(${-BOOK_THICKNESS / 2}px)` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

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
      className="relative bg-[#f4f3ec] pt-28 pb-8 md:pt-32 md:pb-12 min-h-[80vh] flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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

          <div className="relative order-1 lg:order-2 h-[420px] md:h-[520px] lg:h-[600px] flex items-center justify-center px-4 sm:px-8 lg:pr-[max(4rem,calc((100vw-80rem)/2+4rem))]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                className="h-full w-full flex items-center justify-center"
              >
                <Book3D src={activeReview.image} alt={activeReview.bookTitle} />
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
