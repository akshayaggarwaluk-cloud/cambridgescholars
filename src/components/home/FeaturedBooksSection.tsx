import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  },
  {
    id: "2",
    label: "Featured Book",
    title: "Japanese Sensibility and Oriental Wisdom",
    subtitle: "In Search of a New Lifestyle in the New Era",
    description: "Drawing on a 40-year career as a diplomat, this book demystifies Japanese culture. It is the first in English to examine the twin concepts of Japanese sensibility and Oriental wisdom, arguing for their vital role in fostering closer cooperation between East and West.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036413484.jpg",
  },
  {
    id: "3",
    label: "Featured Book",
    title: "Exploring Christian Identity from Late Antiquity to the Middle Ages",
    subtitle: "Neither Greek nor Roman",
    description: "This book challenges the popular view that all Byzantines linked faith, Hellenic culture, and Roman rule. It explores the resistance of St. Maximus the Confessor to the emperor's power in the church, revealing that many did not recognise the office of the emperor as holy.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036410988.jpg",
  },
  {
    id: "4",
    label: "Featured Book",
    title: "Gender Identity in International Law",
    subtitle: "A Certain Inconvenience",
    description: "This book challenges prevailing narratives by refashioning gender identity as a belief. This reframing protects the conflicting rights of women, children, and LGB people, as well as the right of people to express a gender identity incongruent with their sex.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036405502.jpg",
  },
  {
    id: "5",
    label: "Featured Book",
    title: "The Political Activism of Anthropologist Franz Boas, Citizen Scientist",
    subtitle: null,
    description: "Franz Boas was a ground-breaking anthropologist whose work denied racial superiority and introduced cultural relativity. A fierce pacifist and defender of free speech, he was among the first to recognize the strength of a scientist speaking out on political issues.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781527566859.jpg",
  },
  {
    id: "6",
    label: "Featured Book",
    title: "Black British Women's Writing in the 1970s and Beyond",
    subtitle: "Away from Home",
    description: "This collection of essays examines Black British women writers published from the 1970s to the 2000s. Connected to the UK through migration yet attached to their cultural origins, their work explores a crucial question: how were they able to conceptualise 'home' in their fiction?",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781527552746.jpg",
  },
  {
    id: "7",
    label: "Featured Book",
    title: "Interpreting Literary Texts",
    subtitle: "A Post-Kantian Approach",
    description: "This book explores how textual interpretation evolved from Classicism to Postmodernism. Using novels by authors like Jane Austen, Patrick White, and Margaret Atwood, it traces the shifts in literary movements and philosophical concepts of truth, reason, and the human mind.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036410506.jpg",
  },
  {
    id: "8",
    label: "Featured Book",
    title: "After the Genocides",
    subtitle: "Immigration, Education, and the Prevention of Nuclear War, a Memoir",
    description: "A sweeping memoir of the author's Jewish and Armenian families, this account moves from genocide and the Cold War to his work with American and Russian leaders to prevent nuclear war, culminating in his organization winning the Nobel Peace Prize.",
    image: "https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/9781036412937.jpg",
  }
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeBook = featuredBooks[activeIndex];

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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Scrolling book covers */}
          <div className="order-2 lg:order-1">
            <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
              <div 
                className="flex flex-col gap-4 absolute w-full transition-transform duration-700 ease-out"
                style={{
                  transform: `translateY(-${activeIndex * 200}px)`
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
                      activeIndex === index
                        ? "bg-card shadow-md"
                        : "opacity-50 hover:opacity-80"
                    )}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-accent font-medium uppercase tracking-wide mb-1">
                        {book.label}
                      </p>
                      <h4 className="font-serif font-semibold text-foreground text-sm line-clamp-2">
                        {book.title}
                      </h4>
                      {book.subtitle && (
                        <p className="text-xs text-muted-foreground italic line-clamp-1 mt-1">
                          {book.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Gradient overlays */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-secondary to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-secondary to-transparent pointer-events-none z-10" />
            </div>
          </div>

          {/* Right - Featured book details */}
          <div className="order-1 lg:order-2 flex flex-col">
            <div className="space-y-4 flex-1">
              <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.15em]">
                {activeBook.label}
              </span>
              
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {activeBook.title}
              </h2>
              
              {activeBook.subtitle && (
                <h3 className="text-base md:text-lg text-muted-foreground italic font-serif">
                  {activeBook.subtitle}
                </h3>
              )}
              
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {activeBook.description}
              </p>
              
              <div className="pt-4">
                <Button 
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link to={`/books/${activeBook.id}`}>View</Link>
                </Button>
              </div>
            </div>

            {/* Featured book image */}
            <div className="mt-8 flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={activeBook.image}
                  alt={activeBook.title}
                  className="w-40 md:w-48 lg:w-56 h-auto shadow-xl rounded-sm transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
