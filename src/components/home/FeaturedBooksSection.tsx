import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const featuredBooks = [{
  id: "1",
  label: "Featured Book",
  title: "Faith and Fortune in the Creation of Our Modern World",
  subtitle: null,
  description: "Modern industrial society is a fluke of history. This book argues our world is the result of accidental events, not inherent European values.",
  image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036401924.jpg"
}, {
  id: "2",
  label: "Featured Book",
  title: "Japanese Sensibility and Oriental Wisdom",
  subtitle: "In Search of a New Lifestyle in the New Era",
  description: "Drawing on a 40-year career as a diplomat, this book demystifies Japanese culture and explores Japanese sensibility.",
  image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036413484.jpg"
}, {
  id: "3",
  label: "Featured Book",
  title: "Exploring Christian Identity from Late Antiquity to the Middle Ages",
  subtitle: "Neither Greek nor Roman",
  description: "This book challenges the popular view that all Byzantines linked faith, Hellenic culture, and Roman rule.",
  image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036410988.jpg"
}];
export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide((activeIndex + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);
  const changeSlide = nextIndex => {
    if (nextIndex === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(nextIndex);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 400);
  };
  const currentBook = featuredBooks[activeIndex];

  return (
    <section className="py-16 bg-background">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative flex justify-center">
            <img 
              src={currentBook.image} 
              alt={currentBook.title}
              className="w-64 md:w-80 shadow-2xl transition-opacity duration-400"
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wide text-accent">{currentBook.label}</span>
            <h2 className="font-serif text-3xl font-bold leading-tight">{currentBook.title}</h2>
            {currentBook.subtitle && (
              <h3 className="italic text-muted-foreground">{currentBook.subtitle}</h3>
            )}
            <p className="text-muted-foreground line-clamp-4">{currentBook.description}</p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 border border-accent">
              <Link to={`/books/${currentBook.id}`}>View</Link>
            </Button>

            {/* Dots */}
            <div className="flex gap-2 pt-4">
              {featuredBooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === activeIndex ? "bg-accent" : "bg-muted-foreground/30"
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

/* CONTENT BLOCK */
function Content({
  book
}) {
  return <>
      <span className="text-xs uppercase tracking-wide text-accent">{book.label}</span>

      <h2 className="font-serif text-3xl font-bold leading-tight">{book.title}</h2>

      <h3 className="italic text-muted-foreground min-h-[28px]">{book.subtitle ?? "\u00A0"}</h3>

      <p className="text-muted-foreground line-clamp-4 min-h-[96px]">{book.description}</p>

      <Button asChild className="bg-[#E4573D] text-white hover:bg-white hover:text-[#E4573D] border border-[#E4573D]">
        <Link to={`/books/${book.id}`}>View</Link>
      </Button>

      <div className="pt-6">
        <img src={book.image} className="w-52 shadow-xl" />
      </div>
    </>;
}