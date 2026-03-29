import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const featuredBooks = [
  {
    id: "978-1-0364-4496-9",
    title: "Quantum Science and Yijing Theory",
    subtitle: null,
    description:
      "What did the creators of the ancient Yijing (Book of Changes) think about the mind and the universe? This book explores the connections between modern quantum science and the Yijing.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036444969.jpg",
  },
  {
    id: "978-1-0364-5065-6",
    title: "A Brief History of Philosophy and Science",
    subtitle: "Imagining our World",
    description:
      "This book traces the relationship between science and philosophy from the Ancient Greeks to the Enlightenment.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036450656.jpg",
  },
  {
    id: "978-1-0364-5309-1",
    title: "Understanding Non-Ordinary Mental Expressions and their Capabilities",
    subtitle: null,
    description:
      "Near-death experiences, mystical states, and lucid dreaming have long been dismissed as dysfunctional phenomena. This book presents a transdisciplinary scientific approach.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036453091.jpg",
  },
  {
    id: "978-1-0364-0357-7",
    title: "A History of Poets' Reception of Mark Twain, 1863-1936",
    subtitle: null,
    description:
      "This collection of 350 poems about Mark Twain explores a neglected dimension of his popular reception.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036403577.jpg",
  },
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const goTo = (dir: "prev" | "next") => {
    setActiveIndex((prev) =>
      dir === "next"
        ? (prev + 1) % featuredBooks.length
        : (prev - 1 + featuredBooks.length) % featuredBooks.length
    );
  };

  const book = featuredBooks[activeIndex];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-wide">
        {/* Section Label */}
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em] text-center mb-2">
          Featured Book
        </p>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mt-8">
          {/* Book Cover - Left */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={book.image}
                alt={book.title}
                className="w-56 md:w-72 shadow-2xl"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
          </div>

          {/* Content - Right */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">
                  Featured Book
                </p>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal leading-tight text-foreground">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <h3 className="font-serif italic text-lg text-muted-foreground">
                    {book.subtitle}
                  </h3>
                )}
                <p className="text-foreground/70 leading-relaxed text-base">
                  {book.description}
                </p>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 text-sm tracking-wider"
                >
                  <Link to={`/books/${book.id}`}>View</Link>
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            <div className="flex items-center gap-4 pt-6">
              <button
                onClick={() => goTo("prev")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Previous featured book"
              >
                <span className="text-sm tracking-wider">prev</span>
              </button>
              <span className="text-muted-foreground/30">|</span>
              <button
                onClick={() => goTo("next")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Next featured book"
              >
                <span className="text-sm tracking-wider">next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
