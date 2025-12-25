import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Featured books data matching Cambridge Scholars style
const featuredBooks = [
  {
    id: "1",
    label: "Featured Book",
    title: "Faith and Fortune in the Creation of Our Modern World",
    subtitle: null,
    description: "Modern industrial society is a fluke of history. This book argues our world is the result of accidental events, not inherent European values. Our advanced civilization is an unexpected explosion, unique and unlikely to be found anywhere else in the universe.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036401924.jpg",
    price: "£44.99"
  },
  {
    id: "2",
    label: "Featured Book",
    title: "Japanese Sensibility and Oriental Wisdom",
    subtitle: "In Search of a New Lifestyle in the New Era",
    description: "Drawing on a 40-year career as a diplomat, this book demystifies Japanese culture. It is the first in English to examine the twin concepts of Japanese sensibility and Oriental wisdom, arguing for their vital role in fostering closer cooperation between East and West.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036413484.jpg",
    price: "£49.99"
  },
  {
    id: "3",
    label: "Featured Book",
    title: "Exploring Christian Identity from Late Antiquity to the Middle Ages",
    subtitle: "Neither Greek nor Roman",
    description: "This book challenges the popular view that all Byzantines linked faith, Hellenic culture, and Roman rule. It explores the resistance of St. Maximus the Confessor to the emperor's power in the church, revealing that many did not recognise the office of the emperor as holy.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036410988.jpg",
    price: "£54.99"
  },
  {
    id: "4",
    label: "Featured Book",
    title: "Gender Identity in International Law",
    subtitle: "A Certain Inconvenience",
    description: "This book challenges prevailing narratives by refashioning gender identity as a belief. This reframing protects the conflicting rights of women, children, and LGB people, as well as the right of people to express a gender identity incongruent with their sex.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036405502.jpg",
    price: "£39.99"
  },
  {
    id: "5",
    label: "Featured Book",
    title: "The Political Activism of Anthropologist Franz Boas, Citizen Scientist",
    subtitle: null,
    description: "Franz Boas was a ground-breaking anthropologist whose work denied racial superiority and introduced cultural relativity. A fierce pacifist and defender of free speech, he was among the first to recognize the strength of a scientist speaking out on political issues.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781527566859.jpg",
    price: "£47.99"
  },
  {
    id: "6",
    label: "Featured Book",
    title: "Black British Women's Writing in the 1970s and Beyond",
    subtitle: "Away from Home",
    description: "This collection of essays examines Black British women writers published from the 1970s to the 2000s. Connected to the UK through migration yet attached to their cultural origins, their work explores a crucial question: how were they able to conceptualise 'home' in their fiction?",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781527552746.jpg",
    price: "£52.99"
  }
];

export function FeaturedBooksCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeBook = featuredBooks[activeIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
  };

  return (
    <section className="py-16 md:py-20 bg-secondary">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left - Featured Book Details */}
          <div className="space-y-4">
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.15em]">
              {activeBook.label}
            </span>
            
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {activeBook.title}
            </h2>
            
            {activeBook.subtitle && (
              <h3 className="text-lg text-muted-foreground italic font-serif">
                {activeBook.subtitle}
              </h3>
            )}
            
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {activeBook.description}
            </p>
            
            <div className="pt-2">
              <Button 
                asChild
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Link to={`/books/${activeBook.id}`}>View</Link>
              </Button>
            </div>
          </div>

          {/* Right - Book Cover with Navigation */}
          <div className="relative">
            {/* Main Book Cover */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 md:w-56 lg:w-64">
                <img
                  src={activeBook.image}
                  alt={activeBook.title}
                  className="w-full h-auto shadow-xl rounded-sm transition-all duration-500"
                />
              </div>
            </div>

            {/* Thumbnails Carousel */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrev}
                  className="h-8 w-8 rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div 
                  ref={carouselRef}
                  className="flex-1 overflow-hidden"
                >
                  <div 
                    className="flex gap-3 transition-transform duration-500"
                    style={{ 
                      transform: `translateX(-${Math.max(0, activeIndex - 2) * 88}px)` 
                    }}
                  >
                    {featuredBooks.map((book, index) => (
                      <button
                        key={book.id}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setActiveIndex(index);
                        }}
                        className={cn(
                          "shrink-0 w-20 h-28 rounded overflow-hidden transition-all duration-300",
                          activeIndex === index
                            ? "ring-2 ring-accent ring-offset-2 ring-offset-secondary"
                            : "opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="h-8 w-8 rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {featuredBooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(index);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    activeIndex === index
                      ? "w-6 bg-accent"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
