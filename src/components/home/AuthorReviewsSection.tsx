import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetchAuthorReviews } from "@/services/cspApi";

interface AuthorReview {
  author: string;
  bookTitle: string;
  praise: string;
}

export function AuthorReviewsSection() {
  const [reviews, setReviews] = useState<AuthorReview[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuthorReviews()
      .then((data) => {
        setReviews(
          data.map((item) => ({
            author: item.author,
            bookTitle: item.book_title,
            praise: item.praise,
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch author reviews:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container-wide bg-[#004C3A] rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16 min-h-[260px] flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl mx-auto">
            <div className="h-4 bg-white/20 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container-wide bg-[#004C3A] rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
          <p className="text-center text-white/70">No author experiences available at the moment.</p>
        </div>
      </section>
    );
  }

  const active = reviews[activeIndex];

  return (
    <section
      className="py-8 md:py-12"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container-wide bg-[#004C3A] rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-center text-white mb-10">
          Author Experiences
        </h2>

        <div className="max-w-3xl mx-auto min-h-[180px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-5"
            >
              <p className="text-white/90 text-sm md:text-base italic leading-relaxed">
                "{active.praise}"
              </p>
              <div>
                <p className="text-white font-bold text-sm">{active.author}</p>
                <p className="text-white/60 text-xs mt-1">{active.bookTitle}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => { setIsAutoPlaying(false); setActiveIndex(index); }}
              aria-label={`Go to testimonial ${index + 1}`}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                activeIndex === index ? "bg-white scale-110" : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
