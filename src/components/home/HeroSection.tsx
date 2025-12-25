import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Featured reviews similar to Cambridge Scholars
const featuredReviews = [
  {
    id: 1,
    bookTitle: "Fundamentals of Human Ecology",
    subtitle: "A Paradigm for a More Sustainable Economy",
    author: "Dr. Sarah Mitchell & Prof. James Chen",
    quote: "An invaluable gem as a guide to the human condition, which is so lost and without reference points in today's world.",
    reviewer: "Prof. Michael Thompson",
    reviewerTitle: "London School of Economics",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    bookId: "1"
  },
  {
    id: 2,
    bookTitle: "The Psychology of Decision Making",
    subtitle: "Understanding Cognitive Biases in Modern Society",
    author: "Dr. Elena Rodriguez",
    quote: "This remarkable book traces how human decision-making has evolved, offering a powerful reminder that our cognitive frameworks continue to shape our world.",
    reviewer: "Dr. Amara Williams",
    reviewerTitle: "Yale University",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    bookId: "2"
  },
  {
    id: 3,
    bookTitle: "Digital Transformation in Academia",
    subtitle: "Reshaping Higher Education for the 21st Century",
    author: "Prof. David Park",
    quote: "A lucid study that offers concrete guidelines for navigating the digital revolution in academic institutions. Thoughtful, timely, and deeply relevant.",
    reviewer: "Dr. Rachel Foster",
    reviewerTitle: "University of Melbourne",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    bookId: "3"
  }
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeReview = featuredReviews[activeIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % featuredReviews.length);
  };

  return (
    <section className="relative bg-primary pt-32 pb-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-6">
            <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest">
              Featured Review
            </span>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {activeReview.bookTitle}
            </h1>
            
            {activeReview.subtitle && (
              <p className="text-xl text-primary-foreground/80 italic">
                {activeReview.subtitle}
              </p>
            )}
            
            <p className="text-primary-foreground/70">
              By {activeReview.author}
            </p>

            {/* Quote */}
            <div className="relative pl-6 border-l-2 border-accent py-2">
              <Quote className="absolute -left-3 -top-1 h-6 w-6 text-accent fill-accent" />
              <p className="text-lg italic text-primary-foreground/90 leading-relaxed">
                "{activeReview.quote}"
              </p>
              <p className="mt-4 text-sm text-primary-foreground/70">
                <span className="font-semibold text-primary-foreground">{activeReview.reviewer}</span>
                <span className="mx-2">—</span>
                {activeReview.reviewerTitle}
              </p>
            </div>

            <div className="pt-4">
              <Button 
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Link to={`/books/${activeReview.bookId}`}>View Book</Link>
              </Button>
            </div>
          </div>

          {/* Book Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Book mockup shadow */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 bg-black/20 rounded-lg blur-xl" />
              
              {/* Main Image */}
              <div className="relative w-64 md:w-80 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={activeReview.image}
                  alt={activeReview.bookTitle}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>

              {/* Thumbnail navigation */}
              <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {featuredReviews.map((review, index) => (
                  <button
                    key={review.id}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setActiveIndex(index);
                    }}
                    className={cn(
                      "w-12 h-16 md:w-14 md:h-20 rounded overflow-hidden transition-all duration-300 border-2",
                      activeIndex === index
                        ? "border-accent scale-110 shadow-lg"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={review.image}
                      alt={review.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="rounded-full border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {featuredReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(index);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeIndex === index
                    ? "w-8 bg-accent"
                    : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="rounded-full border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
