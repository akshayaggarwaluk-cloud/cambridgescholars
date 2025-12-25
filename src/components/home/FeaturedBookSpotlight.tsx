import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { books } from "@/data/books";

export function FeaturedBookSpotlight() {
  // Get the first book as featured
  const featuredBook = books[0];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left - Book Cover */}
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <div className="relative w-64 md:w-72 lg:w-full max-w-xs">
              <div className="absolute -inset-4 bg-accent/5 rounded-lg -z-10" />
              <img
                src={featuredBook.image}
                alt={featuredBook.title}
                className="w-full h-auto shadow-lg rounded-sm"
              />
            </div>
          </div>

          {/* Right - Book Details */}
          <div className="lg:col-span-3 space-y-4">
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.15em]">
              Featured Book
            </span>
            
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              <Link to={`/books/${featuredBook.id}`} className="hover:text-accent transition-colors">
                {featuredBook.title}
              </Link>
            </h2>
            
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Link 
                to={`/books?category=${featuredBook.category.toLowerCase()}`}
                className="hover:text-accent transition-colors"
              >
                {featuredBook.category}
              </Link>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {featuredBook.description}
            </p>
            
            <p className="text-xl font-semibold text-foreground">
              £{featuredBook.price.toFixed(2)}
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                asChild
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Link to={`/books/${featuredBook.id}`}>Quick view</Link>
              </Button>
              <Button 
                asChild
                size="sm"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Link to={`/books/${featuredBook.id}`}>View more</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This product has multiple variants. The options may be chosen on the product page
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
