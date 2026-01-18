import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featuredBooks = [
  {
    id: "1",
    label: "Featured Book",
    title: "Fundamentals of Human Ecology as a Paradigm for a More Sustainable Economy",
    subtitle: "By Nuria Chinchilla Albiol and Pilar García Lombardía",
    description:
      "“An invaluable gem as a guide to the human condition, which is so lost and without reference points in today’s world.”",
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
  {
    id: "4",
    label: "Featured Book",
    title: "Gender Identity in International Law",
    subtitle: "A Certain Inconvenience",
    description:
      "This book challenges prevailing narratives by refashioning gender identity as a belief. This reframing protects the conflicting rights of women, children, and LGB people, as well as the right of people to express a gender identity incongruent with their sex.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036405502.jpg",
  },
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="py-12 md:py-16 bg-secondary overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT LIST */}
          <div className="order-2 lg:order-1">
            <div className="relative h-[420px] lg:h-[500px] overflow-hidden">
              <div
                className="flex flex-col gap-4 absolute w-full transition-transform duration-700 ease-out"
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
                      "flex items-center gap-4 p-3 rounded-lg transition-all duration-300 text-left",
                      activeIndex === index ? "bg-card shadow-md" : "opacity-50 hover:opacity-80",
                    )}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded shadow-sm shrink-0"
                    />
                    <div>
                      <p className="text-xs text-accent uppercase tracking-wide">{book.label}</p>
                      <h4 className="font-serif text-sm font-semibold line-clamp-2">{book.title}</h4>
                      <p className="text-xs italic text-muted-foreground">{book.subtitle ?? "\u00A0"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT – ABSOLUTE STACK */}
          <div className="order-1 lg:order-2 relative min-h-[560px]">
            {featuredBooks.map((book, index) => (
              <div
                key={book.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  index === activeIndex ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                )}
              >
                <div className="flex flex-col h-full">
                  <div className="space-y-4 flex-1">
                    <span className="text-accent text-xs uppercase tracking-[0.15em]">{book.label}</span>

                    <h2 className="font-serif text-3xl lg:text-4xl font-bold">{book.title}</h2>

                    <h3 className="italic text-muted-foreground min-h-[28px]">{book.subtitle ?? "\u00A0"}</h3>

                    <p className="text-muted-foreground line-clamp-4 min-h-[96px]">{book.description}</p>

                    <Button asChild className="bg-accent">
                      <Link to={`/books/${book.id}`}>View</Link>
                    </Button>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <img src={book.image} alt={book.title} className="w-48 shadow-xl rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
