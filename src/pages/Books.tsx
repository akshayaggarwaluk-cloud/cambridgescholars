import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { books as staticBooks, categories } from "@/data/books";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/contexts/CartContext";

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
  const initialCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [publishedBooks, setPublishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync with URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    setSearchQuery(search);
    setSelectedCategory(category);
  }, [searchParams]);

  // Fetch user-published books from database
  useEffect(() => {
    const fetchPublishedBooks = async () => {
      try {
        const { data, error } = await supabase
          .from("published_books")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedBooks: Book[] = data.map((book) => ({
            id: `published_${book.id}`,
            title: book.title,
            author: book.author,
            price: Number(book.price),
            image: book.cover_image || "/placeholder.svg",
            rating: 4.0, // Default rating for new books
            category: book.category,
            description: book.description || undefined,
          }));
          setPublishedBooks(formattedBooks);
        }
      } catch (error) {
        console.error("Error fetching published books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedBooks();
  }, []);

  // Get unique categories from all books
  const allCategories = useMemo(() => {
    const bookCategories = [...staticBooks, ...publishedBooks].map(b => b.category);
    const uniqueCategories = [...new Set(bookCategories)];
    return uniqueCategories.sort();
  }, [publishedBooks]);

  // Combine static and published books
  const allBooks = useMemo(() => {
    return [...staticBooks, ...publishedBooks];
  }, [publishedBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase());

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
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedRating, allBooks]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

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
        <section className="relative bg-gradient-charcoal py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="container-wide relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block text-accent text-sm font-medium tracking-widest uppercase mb-4 animate-fade-up">
                Our Collection
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Discover Your Next
                <span className="block text-gradient-gold mt-2">Literary Adventure</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Explore our curated selection of books across every genre—from timeless classics to contemporary bestsellers.
              </p>
            </div>
          </div>
        </section>

        {/* Filters & Books */}
        <section className="container-wide py-12">
          {/* Search & Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <Input
                type="text"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-14 text-base border-2 border-border bg-card shadow-sm focus:border-accent focus:ring-accent/20 transition-all duration-200 rounded-xl"
              />
            </div>
            <Button
              variant={showFilters ? "gold" : "outline"}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 h-14 px-6 rounded-xl transition-all duration-200"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {(selectedCategory !== "all" ||
                selectedPriceRange !== 0 ||
                selectedRating !== 0) && (
                <span className="ml-2 h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-gold">
                  ✓
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-out mb-8",
              showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Refine Your Search</h3>
                  <p className="text-sm text-muted-foreground mt-1">Filter books by category, price, and rating</p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Category */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-foreground uppercase tracking-wider block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "gold" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryChange("all")}
                      className="rounded-full"
                    >
                      All
                    </Button>
                    {allCategories.map((cat) => (
                      <Button
                        key={cat}
                        variant={
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? "gold"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleCategoryChange(cat.toLowerCase())}
                        className="rounded-full"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-foreground uppercase tracking-wider block">
                    Price Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, idx) => (
                      <Button
                        key={range.label}
                        variant={selectedPriceRange === idx ? "gold" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPriceRange(idx)}
                        className="rounded-full"
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-foreground uppercase tracking-wider block">
                    Rating
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ratingFilters.map((filter, idx) => (
                      <Button
                        key={filter.label}
                        variant={selectedRating === idx ? "gold" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRating(idx)}
                        className="rounded-full"
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {loading ? (
                <span className="inline-flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  <span className="text-base">Curating your collection...</span>
                </span>
              ) : (
                <>
                  <span className="text-3xl font-serif font-bold text-foreground">{filteredBooks.length}</span>
                  <span className="text-muted-foreground text-base">books found</span>
                </>
              )}
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-2xl border border-border/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                No books found
              </h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                We couldn't find any books matching your criteria. Try adjusting your filters.
              </p>
              <Button variant="gold" size="lg" onClick={clearFilters} className="rounded-full px-8">
                Clear All Filters
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
