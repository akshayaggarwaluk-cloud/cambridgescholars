import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuredBooks = [
  {
    id: "978-1-0364-4496-9",
    title: "Quantum Science and Yijing Theory",
    description: "What did the creators of the ancient Yijing (Book of Changes) think about the mind and the universe? This book explores the connections between modern quantum science and the Yijing.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036444969.jpg",
  },
  {
    id: "978-1-0364-5065-6",
    title: "A Brief History of Philosophy and Science",
    description: "This book traces the relationship between science and philosophy from the Ancient Greeks to the Enlightenment.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036450656.jpg",
  },
  {
    id: "978-1-0364-5309-1",
    title: "Understanding Non-Ordinary Mental Expressions and their Capabilities",
    description: "Near-death experiences, mystical states, and lucid dreaming have long been dismissed as dysfunctional phenomena. This book presents a transdisciplinary scientific approach.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036453091.jpg",
  },
  {
    id: "978-1-0364-0357-7",
    title: "A History of Poets' Reception of Mark Twain, 1863-1936",
    description: "This collection of 350 poems about Mark Twain explores a neglected dimension of his popular reception.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036403577.jpg",
  },
  {
    id: "978-1-0364-6222-2",
    title: "From Missiles to Microbes",
    description: "A masterful journey through the world of an innovative chemist. It is a highly readable overview of the fascinating world of an inventor.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036462222.jpg",
  },
  {
    id: "978-1-0364-1807-6",
    title: "Twenty Years in Ukraine",
    description: "This remarkable book is a most readable guide to the roller-coaster ride of modern Ukrainian politics.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036418076.jpg",
  },
  {
    id: "978-1-0364-6134-8",
    title: "The Fraught Balance of Politics and Bureaucrats in American Public Service",
    description: "The author brilliantly explains how and why our public service often seems in turmoil, turbulence, chaos, and constant reform.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036461348.jpg",
  },
  {
    id: "978-1-0364-0291-4",
    title: "Computational Modeling by Case Study",
    description: "This is a book you'll want to read and re-read. The world is complicated enough that we must use models that we know are wrong.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036402914.jpg",
  },
  {
    id: "978-1-0364-5709-9",
    title: "What is Success?",
    description: "A Kaleidoscope of Possibilities from Women in the World Around the World. The revolutionary love and transformative power of feminism.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036457099.jpg",
  },
  {
    id: "978-1-0364-3825-8",
    title: "The Ethics of Artificial Intelligence",
    description: "A comprehensive exploration of the moral and philosophical challenges posed by the rise of artificial intelligence in modern society.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036438258.jpg",
  },
  {
    id: "978-1-0364-2910-2",
    title: "Climate Change and Global Policy",
    description: "An in-depth analysis of international climate agreements and their impact on environmental governance worldwide.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036429102.jpg",
  },
  {
    id: "978-1-0364-3156-3",
    title: "Modern Approaches to Linguistics",
    description: "This volume brings together leading scholars to examine contemporary developments in linguistic theory and practice.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036431563.jpg",
  },
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying]);

  const book = featuredBooks[activeIndex];

  return (
    <section className="py-20 md:py-28 bg-[#f4f3ec]">
      <div className="container-wide">
        <div className="relative grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Previous Arrow */}
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIndex((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length);
            }}
            aria-label="Previous book"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-10 h-10 rounded-full border border-muted-foreground/30 bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Content - Left */}
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
                <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em]">
                  Featured Book
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal leading-[1.15] text-foreground">
                  {book.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base max-w-lg">
                  {book.description}
                </p>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-3 text-sm tracking-wider rounded-none uppercase"
                >
                  <Link to={`/books/${book.id}`}>View</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Book Cover - Right (large) */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end bg-[#f4f3ec]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={book.image}
                alt={book.title}
                className="w-64 md:w-80 lg:w-[360px] mix-blend-multiply"
                initial={{ opacity: 0, scale: 0.95, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -40 }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              />
            </AnimatePresence>
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
            }}
            aria-label="Next book"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-10 h-10 rounded-full border border-muted-foreground/30 bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Navigation with Pause/Play */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            {isAutoPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="1" y="1" width="4" height="10" /><rect x="7" y="1" width="4" height="10" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><polygon points="2,0 12,6 2,12" /></svg>
            )}
          </button>
          {featuredBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(index);
              }}
              aria-label={`Go to featured book ${index + 1}`}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 border",
                activeIndex === index
                  ? "border-accent bg-transparent scale-110"
                  : "border-transparent bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
