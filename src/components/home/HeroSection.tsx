import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

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

const textVariants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

const imageVariants = {
  initial: { opacity: 0, x: 100, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -100, scale: 0.95 },
};

// Floating decorative shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large accent blob */}
      <motion.div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Primary color blob */}
      <motion.div
        className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small floating circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent/40 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-primary/20 rounded-full"
        animate={{
          y: [0, -25, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Decorative lines */}
      <div className="absolute top-20 right-40 w-32 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute bottom-40 left-20 w-24 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </div>
  );
}

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

  return (
    <section className="relative bg-[#f4f3ec] pt-28 pb-12 md:pt-32 md:pb-16 min-h-[85vh] flex items-center overflow-hidden">
      <FloatingShapes />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 dots-pattern opacity-30" />

      <div className="container-wide relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-foreground order-2 lg:order-1 min-h-[400px] md:min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-5"
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.span
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0 }}
                  className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-[0.2em] bg-accent/10 px-4 py-2 rounded-full"
                >
                  <Sparkles className="h-3 w-3" />
                  {activeReview.label}
                </motion.span>

                <motion.h1
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] text-balance text-primary"
                >
                  {activeReview.bookTitle}
                </motion.h1>

                {activeReview.subtitle && (
                  <motion.h2
                    variants={textVariants}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-lg md:text-xl lg:text-2xl text-muted-foreground italic font-serif"
                  >
                    {activeReview.subtitle}
                  </motion.h2>
                )}

                <motion.p
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-muted-foreground text-sm md:text-base"
                >
                  {activeReview.author}
                </motion.p>

                {/* Quote with enhanced styling */}
                <motion.blockquote
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="relative py-4 pl-6 border-l-2 border-accent/30"
                >
                  <p className="text-base md:text-lg italic text-foreground/90 leading-relaxed line-clamp-4">
                    <span className="text-accent text-3xl font-serif leading-none">"</span>
                    {activeReview.quote}
                    <span className="text-accent text-3xl font-serif leading-none">"</span>
                  </p>
                  <footer className="mt-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">– {activeReview.reviewer}</span>
                    <span className="block text-xs mt-1 text-muted-foreground/80">{activeReview.reviewerTitle}</span>
                  </footer>
                </motion.blockquote>

                <motion.div
                  variants={textVariants}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="pt-2 flex gap-4"
                >
                  <Button 
  asChild 
  size="lg"
  className="
    bg-[#E4573D]
    text-white
    hover:bg-white
    hover:text-[#E4573D]
    border border-[#E4573D]
    font-medium
    px-8
    rounded-full
    shadow-accent
    transition-all
    duration-300
    hover:shadow-lg
    hover:scale-105
    group
  "
>
  <Link to={`/books/${activeReview.bookId}`} className="flex items-center gap-2">
    View Book
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
  </Link>
</Button>

                    asChild 
                    variant="outline"
                    size="lg"
                    className="rounded-full border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    <Link to="/books">Browse All</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Book Image - Mockup style with enhanced animation */}
          <div className="relative order-1 lg:order-2 h-[320px] md:h-[400px] lg:h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center lg:justify-end lg:-mr-8 xl:-mr-12"
              >
                {/* Glow effect behind book */}
                <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:-mr-8 xl:-mr-12">
                  <div className="w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
                </div>
                
                <motion.img
                  src={activeReview.image}
                  alt={activeReview.bookTitle}
                  className="h-full w-auto max-w-none object-contain mix-blend-multiply scale-100 lg:scale-110 relative z-10"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex items-center justify-center gap-3 mt-8 md:mt-12">
          {featuredReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(index);
              }}
              className={cn(
                "relative h-2.5 rounded-full transition-all duration-500 overflow-hidden",
                activeIndex === index 
                  ? "w-10 bg-accent shadow-accent" 
                  : "w-2.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
              )}
            >
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-accent/50"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 8,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}