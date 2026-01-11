import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronRight, Heart, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { books as staticBooks } from "@/data/books";
import { categories as bookCategories } from "@/data/categories";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [publishedBooks, setPublishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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
            rating: 4.0,
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

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allBooks]);

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

  // Get count of books per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allBooks.length };
    bookCategories.forEach((cat) => {
      counts[cat.slug] = allBooks.filter(
        (book) => book.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
    });
    return counts;
  }, [allBooks]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header Banner */}
      <div className="bg-secondary pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">
              Bookshop
            </h1>
            <nav className="hidden md:flex items-center text-sm">
              <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                Home
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-accent">Bookshop</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Search */}
            <div className="mb-8">
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">
                Search
              </h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Subject Categories */}
            <div>
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">
                Subject Categories
              </h3>
              <ul className="space-y-2">
                {bookCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.slug)}
                      className={cn(
                        "w-full flex items-center justify-between text-sm py-1 transition-colors",
                        selectedCategory === category.slug
                          ? "text-accent font-medium"
                          : "text-muted-foreground hover:text-accent"
                      )}
                    >
                      <span>{category.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">
                          {categoryCounts[category.slug] || 0}
                        </span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={cn(
                      "w-full flex items-center justify-between text-sm py-1 transition-colors",
                      selectedCategory === "all"
                        ? "text-accent font-medium"
                        : "text-muted-foreground hover:text-accent"
                    )}
                  >
                    <span>All Categories</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{allBooks.length}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Books List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-3 text-muted-foreground">Loading books...</span>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-serif text-foreground mb-2">
                  No books found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredBooks.map((book, index) => (
                  <article
                    key={book.id}
                    className={cn(
                      "py-8",
                      index !== filteredBooks.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Book Cover */}
                      <Link
                        to={`/books/${book.id}`}
                        className="flex-shrink-0 w-full md:w-40"
                      >
                        <div className="aspect-[2/3] overflow-hidden bg-muted">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Book Details */}
                      <div className="flex-1">
                        <Link to={`/books/${book.id}`}>
                          <h2 className="text-xl font-serif text-foreground hover:text-accent transition-colors">
                            {book.title}
                          </h2>
                        </Link>

                        {/* Subtitle - using category as subtitle for now */}
                        <p className="text-base italic text-foreground/80 mt-1">
                          {book.category}
                        </p>

                        {/* Author */}
                        <p className="text-sm text-muted-foreground mt-2">
                          By: <span className="text-accent">{book.author}</span>
                        </p>

                        {/* Description */}
                        {book.description && (
                          <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-justify line-clamp-3">
                            {book.description}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-6">
                          <Button
                            asChild
                            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
                          >
                            <Link to={`/books/${book.id}`}>VIEW MORE</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (isInWishlist(book.id)) {
                                removeFromWishlist(book.id);
                              } else {
                                addToWishlist({
                                  id: book.id,
                                  title: book.title,
                                  author: book.author,
                                  price: book.price,
                                  image: book.image,
                                  rating: book.rating,
                                  category: book.category,
                                });
                              }
                            }}
                            className={cn(
                              "border-border",
                              isInWishlist(book.id) && "text-red-500 border-red-500"
                            )}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                isInWishlist(book.id) && "fill-current"
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
