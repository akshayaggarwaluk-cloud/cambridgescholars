import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronDown, Heart, Loader2 } from "lucide-react";
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
        const { data, error } = await supabase.from("published_books").select("*").order("created_at", {
          ascending: false,
        });
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
        selectedCategory === "all" || book.category.toLowerCase() === selectedCategory.toLowerCase();
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
    const counts: Record<string, number> = {
      all: allBooks.length,
    };
    bookCategories.forEach((cat) => {
      counts[cat.slug] = allBooks.filter((book) => book.category.toLowerCase() === cat.name.toLowerCase()).length;
    });
    return counts;
  }, [allBooks]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header Banner */}
      <div className="bg-[#f4f3ec] min-h-[280px] pt-24 px-6 md:px-16 flex items-center">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <h1 className="text-5xl font-serif text-gray-800">Bookshop</h1>
          <PageBreadcrumb currentPage="Bookshop" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Search Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-serif text-foreground mb-6 pb-3 border-b-2 border-foreground/20">Search</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pr-12 h-12 border-border bg-background text-base"
                />
                <button className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center bg-muted/50 border-l border-border hover:bg-muted transition-colors">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Subject Categories */}
            <div>
              <h3 className="text-2xl font-serif text-foreground mb-6 pb-3 border-b-2 border-foreground/20">
                Subject Categories
              </h3>
              <ul className="space-y-1">
                {bookCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.slug)}
                      className={cn(
                        "w-full flex items-center justify-between py-2 text-base transition-colors group",
                        selectedCategory === category.slug
                          ? "text-[#E4573D] font-medium"
                          : "text-[#E4573D] hover:text-[#c94a32]",
                      )}
                    >
                      <span>{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">{categoryCounts[category.slug] || 0}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={cn(
                      "w-full flex items-center justify-between py-2 text-base transition-colors",
                      selectedCategory === "all" ? "text-[#E4573D] font-medium" : "text-[#E4573D] hover:text-[#c94a32]",
                    )}
                  >
                    <span>All Categories</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">{allBooks.length}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Books List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-3 text-muted-foreground">Loading books...</span>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-serif text-foreground mb-2">No books found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredBooks.map((book) => (
                  <article key={book.id} className="py-10 first:pt-0">
                    <div className="flex flex-col md:flex-row gap-10">
                      {/* Book Cover - Larger size */}
                      <Link to={`/books/${book.id}`} className="flex-shrink-0 w-full md:w-56">
                        <div className="aspect-[2/3] overflow-hidden shadow-xl">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Book Details - Scaled up to match */}
                      <div className="flex-1 flex flex-col justify-center">
                        {/* Title */}
                        <Link to={`/books/${book.id}`}>
                          <h2 className="text-3xl font-serif text-foreground hover:text-[#E4573D] transition-colors leading-tight">
                            {book.title}
                          </h2>
                        </Link>

                        {/* Subtitle - using description as subtitle */}
                        {book.description && (
                          <p className="text-xl italic text-foreground/80 mt-3 leading-snug">
                            {book.description.length > 80
                              ? book.description.substring(0, 80) + "..."
                              : book.description}
                          </p>
                        )}

                        {/* Author */}
                        <p className="text-lg text-muted-foreground mt-4">
                          By: <span className="text-foreground">{book.author}</span>
                        </p>

                        {/* Description/Blurb */}
                        {book.description && (
                          <p className="text-base text-muted-foreground mt-5 leading-relaxed line-clamp-4">
                            {book.description}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-8">
                          <Button
                            asChild
                            className="bg-[#E4573D] hover:bg-[#c94a32] text-white px-10 h-14 text-lg font-medium rounded-sm"
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
                              "h-14 w-14 rounded-sm border-border",
                              isInWishlist(book.id) && "text-red-500 border-red-500 bg-red-50",
                            )}
                          >
                            <Heart className={cn("h-6 w-6", isInWishlist(book.id) && "fill-current")} />
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
