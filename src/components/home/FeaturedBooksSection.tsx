import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { fetchFeaturedBooks } from "@/services/cspApi";

interface FeaturedBook {
  id: string;
  title: string;
  description: string;
  image: string;
  reviewer: string;
  reviewerPosition: string;
}

export function FeaturedBooksSection() {
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks()
      .then((data) => {
        const mapped: FeaturedBook[] = data
          .filter((item) => item.cover_image)
          .map((item) => {
            // Fix ISBN-10 → ISBN-13 cover URL (matches Hero behavior)
            let coverImage = item.cover_image || "";
            const isbnMatch = coverImage.match(/\/(\d{10})\.jpg$/);
            if (isbnMatch && !coverImage.includes("/978")) {
              coverImage = coverImage.replace(`/${isbnMatch[1]}.jpg`, `/978${isbnMatch[1]}.jpg`);
            }
            const reviewer = item.featured_reviewer;
            return {
              id: item.isbn,
              title: item.title,
              description: reviewer?.rationale || item.description || "",
              image: coverImage,
              reviewer: reviewer?.name || "",
              reviewerPosition: reviewer?.position || "",
            };
          });
        setFeaturedBooks(mapped);
      })
      .catch((err) => console.error("Failed to fetch featured books:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || featuredBooks.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredBooks.length]);

  if (isLoading) {
    return (
      <section className="py-20 bg-[#f4f3ec] overflow-hidden md:py-[20px]">
        <div className="container-wide">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-1/2" />
          </div>
        </div>
      </section>
    );
  }

  if (featuredBooks.length === 0) {
    return (
      <section className="py-20 bg-[#f4f3ec] overflow-hidden md:py-[20px]">
        <div className="container-wide">
          <p className="font-baskerville text-accent uppercase tracking-[0.3em] mb-4 text-lg font-medium">Featured Book</p>
          <p className="text-muted-foreground text-base">No featured books available at the moment.</p>
        </div>
      </section>
    );
  }

  const book = featuredBooks[activeIndex];

  return (
    <section
      className="py-20 bg-[#f4f3ec] overflow-visible md:py-[20px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container-wide">
        <div className="relative grid md:grid-cols-[1.4fr_0.6fr] gap-8 items-center min-h-[500px]">
          <div className="order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <p className="font-baskerville text-[#e4573d] uppercase tracking-[0.3em] text-lg font-medium">Featured Book</p>
                <h2 className="font-baskerville text-3xl md:text-4xl font-normal leading-[1.15] text-foreground lg:text-4xl">{book.title}</h2>
                {book.description && (
                  <p className="font-nav text-muted-foreground leading-relaxed text-base italic font-normal" style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif" }}>"{book.description}"</p>
                )}
                <Button asChild className="bg-[#e4573d] text-white border border-[#e4573d] hover:bg-transparent hover:text-[#e4573d] px-10 py-3 text-sm tracking-wider rounded-none uppercase font-nav font-bold transition-colors" style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif" }}>
                  <Link to={`/books/${book.id}`}>View</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end px-4 md:px-6 lg:px-8 overflow-visible">
            <AnimatePresence mode="wait">
              <motion.img key={activeIndex} src={book.image} alt={book.title} className="h-auto w-[clamp(9rem,20vw,17rem)] max-w-[min(100%,calc(100vw-2rem))] object-contain" style={{ filter: "drop-shadow(18px 22px 18px rgba(0,0,0,0.35))" }} initial={{ opacity: 0, scale: 0.95, x: 24 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: -24 }} transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }} />
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-16">
          {featuredBooks.map((_, index) => (
            <button key={index} onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }} aria-label={`Go to featured book ${index + 1}`} className={cn("w-3 h-3 rounded-full transition-all duration-300 border", activeIndex === index ? "border-accent bg-transparent scale-110" : "border-transparent bg-muted-foreground/30 hover:bg-muted-foreground/50")} />
          ))}
        </div>
      </div>
    </section>
  );
}
