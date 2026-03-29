import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const authorReviews = [
  {
    bookTitle: "Responding to Creative Writing",
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-37.jpg",
    quote:
      "I have worked with many presses, all around the world, and I can say that I have greatly enjoyed working with Cambridge Scholars, and the very fine results. Cambridge Scholars has shown a commitment to advancing the exchange of human knowledge that is clearly very exciting.",
    author: "Professor Graeme Harper",
    authorTitle: "Dean, Honours College, Oakland University",
  },
  {
    bookTitle: "Civilization at Risk: Seeds of Strife",
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-31.jpg",
    quote:
      "I have appreciated and enjoyed, so very much, working with all the wonderful people at Cambridge Scholars; theirs is a great team. Throughout our relationship there only has been graciousness, consideration, and professionalism on their part.",
    author: "Dr. Ron D. Petitte",
    authorTitle: "Professor of Politics, Bryan College",
  },
  {
    bookTitle: "Fandom At The Crossroads",
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-311.jpg",
    quote:
      "I would highly recommend working with Cambridge Scholars, who are not afraid to take a chance on an exciting new project and are skilled at providing assistance with all phases of the publication process.",
    author: "Dr. Lynn Zubernis",
    authorTitle: "Clinical Psychologist & Professor, West Chester University",
  },
  {
    bookTitle: "As Mirrors Are Lonely",
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-32.jpg",
    quote:
      "I always feel that my knowledge is valued and remains at the forefront of what the final product looks like. Knowing that there is always advice at hand, yet also having a deal of academic freedom has been a refreshing experience.",
    author: "Dr. Peter Whiteman",
    authorTitle: "Head of Early Childhood, Macquarie University",
  },
  {
    bookTitle: "Quine on Ethics",
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/9781527567740-2.jpg",
    quote:
      "It has, in fact, been an absolute joy to work with everyone at Cambridge Scholars Publishing throughout the entire publication process. What a gem of a publishing house!",
    author: "Dr. Necip Fikri Alican",
    authorTitle: "Philosopher, ethics & ancient philosophy",
  },
];

export function AuthorReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % authorReviews.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const goTo = (dir: "prev" | "next") => {
    setActiveIndex((prev) =>
      dir === "next"
        ? (prev + 1) % authorReviews.length
        : (prev - 1 + authorReviews.length) % authorReviews.length
    );
  };

  const review = authorReviews[activeIndex];

  return (
    <section className="py-20 md:py-24 bg-[#004C3A] text-white overflow-hidden">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] mb-2">
            Author Reviews
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal">
            Latest Reviews
          </h2>
        </div>

        {/* Review Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5 }}
            >
              {/* Book Image */}
              <div className="flex justify-center">
                <img
                  src={review.bookImage}
                  alt={review.bookTitle}
                  className="w-48 md:w-64 shadow-2xl"
                />
              </div>

              {/* Quote Content */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl md:text-2xl font-normal">
                  {review.bookTitle}
                </h3>
                <blockquote className="text-white/85 text-base md:text-lg italic leading-relaxed">
                  "{review.quote}"
                </blockquote>
                <p className="text-white/70 text-sm">
                  <span className="font-semibold text-white">{review.author}</span>{" "}
                  – {review.authorTitle}
                </p>
                <Link
                  to="/books"
                  className="inline-block text-xs uppercase tracking-wider text-white/80 hover:text-white border-b border-white/30 hover:border-white pb-1 transition-colors"
                >
                  VIEW BOOK
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={() => goTo("prev")}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {authorReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-white w-6" : "bg-white/30"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo("next")}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* All Reviews Link */}
          <div className="text-center mt-8">
            <Link
              to="/books"
              className="inline-block text-xs uppercase tracking-wider text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
            >
              ALL REVIEWS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
