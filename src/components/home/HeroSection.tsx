import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const featuredReviews = [
  {
    id: 1,
    bookTitle: "Twenty Years in Ukraine",
    author: "By Dennis Ougrin, Anastasia Ougrin and Sophie Vounder",
    quote: "This remarkable book is a most readable guide to the roller-coaster ride of modern Ukrainian politics.",
    reviewer: "Roald Hoffman",
    reviewerTitle: "Frank H. T. Rhodes Professor of Humane Letters Emeritus at Cornell University, 1981 Chemistry Nobel Prize winner",
    image: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/Twenty-Years-in-Ukraine.png",
    bookId: "978-1-0364-1807-6",
  },
  {
    id: 2,
    bookTitle: "From Missiles to Microbes",
    author: "By Solomon Rosenblatt",
    quote: "a masterful journey through the world of an innovative chemist. It is a highly readable overview of the fascinating world of an inventor.",
    reviewer: "Dr Philip M. Tierno, Jr",
    reviewerTitle: "Professor of Microbiology and Pathology, NYU (New York University) Grossman School of Medicine",
    image: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/From-Missiles-to-Microbes.png",
    bookId: "978-1-0364-6222-2",
  },
  {
    id: 3,
    bookTitle: "The Fraught Balance of Politics and Bureaucrats in American Public Service",
    author: "By Mordecai Lee",
    quote: "The author brilliantly explains how and why our public service often seems in turmoil, turbulence, chaos, and constant reform.",
    reviewer: "David H. Rosenbloom",
    reviewerTitle: "Distinguished Professor Emeritus, American University, US",
    image: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/The-Fraught-Balance.png",
    bookId: "978-1-0364-6134-8",
  },
  {
    id: 4,
    bookTitle: "Computational Modeling by Case Study",
    subtitle: "All Models Are Uncertain",
    author: "By Zachary del Rosario and Gianluca Iaccarino",
    quote: "This is a book you'll want to read and re-read. The world is complicated enough that we must use models that we know are wrong.",
    reviewer: "Art B. Owen",
    reviewerTitle: "Professor of Statistics, Stanford University",
    image: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/Computational-Modeling-by-Case-Study.png",
    bookId: "978-1-0364-0291-4",
  },
  {
    id: 5,
    bookTitle: "What is Success?",
    subtitle: "A Kaleidoscope of Possibilities from Women in the World Around the World",
    author: "By Rana Dajani",
    quote: "The revolutionary love and transformative power of feminism as a world view and political ideology has often been diminished by misleading creation stories.",
    reviewer: "Kavita Ramdas",
    reviewerTitle: "Richard von Weisäcker Fellow of the Robert Bosch Academy, Berlin, Germany",
    image: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2021/12/What-is-success.png",
    bookId: "978-1-0364-5709-9",
  },
];

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
          {/* Content - Left Side */}
          <div className="text-foreground order-2 lg:order-1 min-h-[380px] md:min-h-[420px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-5"
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Label */}
                <motion.p
                  variants={textVariants}
                  transition={{ duration: 0.4 }}
                  className="text-accent text-xs font-semibold uppercase tracking-[0.25em]"
                >
                  Featured Review
                </motion.p>

                {/* Book Title */}
                <motion.h1
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-normal leading-[1.15] text-foreground"
                >
                  {activeReview.bookTitle}
                </motion.h1>

                {/* Author */}
                <motion.p
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-foreground text-base font-medium"
                >
                  {activeReview.author}
                </motion.p>

                {/* Quote */}
                <motion.p
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-muted-foreground text-sm md:text-base italic leading-relaxed"
                >
                  "{activeReview.quote}"
                </motion.p>

                {/* Reviewer Credit */}
                <motion.p
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-foreground text-sm font-semibold"
                >
                  – ⁠{activeReview.reviewer},{" "}
                  <span className="font-normal">{activeReview.reviewerTitle}</span>
                </motion.p>

                {/* View Button */}
                <motion.div
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="pt-2"
                >
                  <Button
                    asChild
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-3 text-sm tracking-wider"
                  >
                    <Link to={`/books/${activeReview.bookId}`}>VIEW</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Book Cover - Right Side with tilt and shadow */}
          <div className="relative order-1 lg:order-2 h-[350px] md:h-[440px] lg:h-[540px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center lg:justify-end"
              >
                <img
                  src={activeReview.image}
                  alt={activeReview.bookTitle}
                  className="h-full w-auto max-w-none object-contain mix-blend-multiply drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(8px 12px 20px rgba(0,0,0,0.15))",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dot Navigation with Pause/Play */}
        <div className="flex items-center justify-center gap-3 mt-8 md:mt-10">
          {featuredReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                activeIndex === index
                  ? "bg-accent scale-110"
                  : "bg-muted-foreground/25 hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
