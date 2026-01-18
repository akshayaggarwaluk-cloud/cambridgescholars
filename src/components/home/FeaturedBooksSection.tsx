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
    description: "Modern industrial society is a fluke of history...",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036401924.jpg",
  },
  {
    id: "2",
    label: "Featured Book",
    title: "Japanese Sensibility and Oriental Wisdom",
    subtitle: "In Search of a New Lifestyle in the New Era",
    description: "Drawing on a 40-year career as a diplomat...",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036413484.jpg",
  },
  {
    id: "3",
    label: "Featured Book",
    title: "Exploring Christian Identity from Late Antiquity to the Middle Ages",
    subtitle: "Neither Greek nor Roman",
    description: "This book challenges the popular view...",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036410988.jpg",
  },
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0); // LEFT SLIDE
  const [displayIndex, setDisplayIndex] = useState(0); // RIGHT CONTENT
  const [pendingIndex, setPendingIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const book = featuredBooks[displayIndex];

  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Transition orchestrator
  useEffect(() => {
    if (pendingIndex === displayIndex) return;

    // 1️⃣ Fade OUT content
    setIsFading(true);

    // 2️⃣ After fade-out, slide list + swap content
    const mid = setTimeout(() => {
      setActiveIndex(pendingIndex);
      setDisplayIndex(pendingIndex);
    }, 250);

    // 3️⃣ Fade IN
    const end = setTimeout(() => {
      setIsFading(false);
    }, 500);

    return () => {
      clearTimeout(mid);
      clearTimeout(end);
    };
  }, [pendingIndex]);

  return (
    <section className="py-16 bg-secondary overflow-hidden">
      <div className="container-wide grid lg:grid-cols-2 gap-12">
        {/* LEFT LIST */}
        <div className="relative h-[420px] overflow-hidden">
          <div
            className="absolute w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${activeIndex * 200}px)` }}
          >
            {featuredBooks.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setPendingIndex(i)}
                className={cn(
                  "flex gap-4 p-3 rounded-lg text-left transition-opacity",
                  activeIndex === i ? "bg-card shadow" : "opacity-50",
                )}
              >
                <img src={b.image} className="w-16 h-24 object-cover" />
                <div>
                  <p className="text-xs uppercase text-accent">{b.label}</p>
                  <h4 className="font-serif text-sm font-semibold line-clamp-2">{b.title}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col">
          <div
            className={cn(
              "space-y-4 min-h-[320px] transition-all duration-250",
              isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
            )}
          >
            <span className="text-xs uppercase tracking-wide text-accent">{book.label}</span>

            <h2 className="font-serif text-3xl font-bold">{book.title}</h2>

            <h3 className="italic text-muted-foreground min-h-[28px]">{book.subtitle ?? "\u00A0"}</h3>

            <p className="text-muted-foreground line-clamp-4 min-h-[96px]">{book.description}</p>

            <Button asChild className="bg-accent">
              <Link to={`/books/${book.id}`}>View</Link>
            </Button>
          </div>

          <div
            className={cn("mt-8 min-h-[260px] transition-opacity duration-250", isFading ? "opacity-0" : "opacity-100")}
          >
            <img src={book.image} className="w-52 shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
