import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { books, categories } from "@/data/books";
import { cn } from "@/lib/utils";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 - $20", min: 10, max: 20 },
  { label: "$20 - $50", min: 20, max: 50 },
  { label: "Over $50", min: 50, max: Infinity },
];

const ratingFilters = [
  { label: "All Ratings", min: 0 },
  { label: "4.5+ Stars", min: 4.5 },
  { label: "4+ Stars", min: 4 },
  { label: "3.5+ Stars", min: 3.5 },
];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        book.category.toLowerCase() === selectedCategory.toLowerCase();

      const priceRange = priceRanges[selectedPriceRange];
      const matchesPrice =
        book.price >= priceRange.min && book.price < priceRange.max;

      const ratingFilter = ratingFilters[selectedRating];
      const matchesRating = book.rating >= ratingFilter.min;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedRating]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange(0);
    setSelectedRating(0);
    setSearchQuery("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="bg-secondary py-16">
          <div className="container-wide">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse Our Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore thousands of titles across every genre. Find your next
              favorite read.
            </p>
          </div>
        </section>

        {/* Filters & Books */}
        <section className="container-wide py-12">
          {/* Search & Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(selectedCategory !== "all" ||
                selectedPriceRange !== 0 ||
                selectedRating !== 0) && (
                <span className="ml-1 h-5 w-5 rounded-full bg-accent text-primary text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 mb-8",
              showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                  <X className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "gold" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.name}
                        variant={
                          selectedCategory.toLowerCase() ===
                          cat.name.toLowerCase()
                            ? "gold"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSelectedCategory(cat.name.toLowerCase())
                        }
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Price Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, idx) => (
                      <Button
                        key={range.label}
                        variant={selectedPriceRange === idx ? "gold" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPriceRange(idx)}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Rating
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ratingFilters.map((filter, idx) => (
                      <Button
                        key={filter.label}
                        variant={selectedRating === idx ? "gold" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRating(idx)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Showing {filteredBooks.length} of {books.length} books
          </p>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No books found matching your criteria.
              </p>
              <Button variant="gold" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
