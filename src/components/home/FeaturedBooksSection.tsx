import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featuredBooks = [
  {
    id: "1",
    label: "Featured Book",
    title: "Faith and Fortune in the Creation of Our Modern World",
    subtitle: null,
    description:
      "Modern industrial society is a fluke of history. This book argues our world is the result of accidental events, not inherent European values. Our advanced civilization is an unexpected explosion, unique and unlikely to be found anywhere else in the universe.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036401924.jpg",
  },
  {
    id: "2",
    label: "Featured Book",
    title: "Japanese Sensibility and Oriental Wisdom",
    subtitle: "In Search of a New Lifestyle in the New Era",
    description:
      "Drawing on a 40-year career as a diplomat, this book demystifies Japanese culture. It is the first in English to examine the twin concepts of Japanese sensibility and Oriental wisdom, arguing for their vital role in fostering closer cooperation between East and West.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036413484.jpg",
  },
  {
    id: "3",
    label: "Featured Book",
    title: "Exploring Christian Identity from Late Antiquity to the Middle Ages",
    subtitle: "Neither Greek nor Roman",
    description:
      "This book challenges the popular view that all Byzantines linked faith, Hellenic culture, and Roman rule. It explores the resistance of St. Maximus the Confessor to the emperor's power in the church, revealing that many did not recognise the office of the emperor as holy.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036410988.jpg",
  },
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeBook = featuredBooks[displayIndex];

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Smooth transition controller
  useEffect(() => {
    if (activeIndex === displayIndex) return;

    setIsFading(true);

    const timeout = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setIsFading(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  return (
    <section className="py-12 md:py-16 bg-secondary overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT – List */}
          <div>
            <div className="relative h-[420px] overflow-hidden">
              <div
                className="absolute w-full transition-transform duration-700 ease-out"
                style={{
                  transform: `translateY(-${activeIndex * 200}px)`,
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
                      "flex gap-4 p-3 rounded-lg transition-all duration-300 text-left",
                      activeIndex === index ? "bg-card shadow-md" : "opacity-50 hover:opacity-80",
                    )}
                  >
                    <img src={book.image} alt={book.title} className="w-16 h-24 object-cover rounded" />
                    <div>
                      <p className="text-xs uppercase text-accent">{book.label}</p>
                      <h4 className="text-sm font-serif font-semibold line-clamp-2">{book.title}</h4>
                      <p className="text-xs italic text-muted-foreground min-h-[16px]">{book.subtitle ?? "\u00A0"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT – Cross-fade content */}
          <div className="flex flex-col">
            <div
              className={cn(
                "space-y-4 min-h-[320px] transition-all duration-300",
                isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
              )}
            >
              <span className="text-xs uppercase tracking-wide text-accent">{activeBook.label}</span>

              <h2 className="font-serif text-3xl font-bold leading-tight">{activeBook.title}</h2>

              <h3 className="italic text-muted-foreground min-h-[28px]">{activeBook.subtitle ?? "\u00A0"}</h3>

              <p className="text-muted-foreground line-clamp-4 min-h-[96px]">{activeBook.description}</p>

              <Button asChild className="bg-accent">
                <Link to={`/books/${activeBook.id}`}>View</Link>
              </Button>
            </div>

            {/* Image cross-fade */}
            <div
              className={cn(
                "mt-8 flex justify-end min-h-[260px] transition-all duration-300",
                isFading ? "opacity-0" : "opacity-100",
              )}
            >
              <img src={activeBook.image} alt={activeBook.title} className="w-52 shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
