import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuredBooks: { id: string; title: string; description: string; image: string }[] = [];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || featuredBooks.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying]);

  if (featuredBooks.length === 0) {
    return (
      <section className="py-20 bg-[#f4f3ec] overflow-hidden md:py-[20px]">
        <div className="container-wide">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">Featured Book</p>
          <p className="text-muted-foreground text-base">No featured books available at the moment.</p>
        </div>
      </section>
    );
  }

  const book = featuredBooks[activeIndex];

  return (
    <section className="py-20 bg-[#f4f3ec] overflow-hidden md:py-[20px]">
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
                <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em]">Featured Book</p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.15] text-foreground">{book.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-base">{book.description}</p>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground px-16 py-3.5 text-sm tracking-[0.2em] rounded-none uppercase">
                  <Link to={`/books/${book.id}`}>View</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-start md:pl-8">
            <AnimatePresence mode="wait">
              <motion.img key={activeIndex} src={book.image} alt={book.title} className="w-56 md:w-64 lg:w-[300px] xl:w-[340px]" initial={{ opacity: 0, scale: 0.95, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: -40 }} transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }} />
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
