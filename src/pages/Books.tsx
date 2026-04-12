import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronDown, Heart, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchBooks, fetchCategories, CSPPagination, CSPCategory } from "@/services/cspApi";
import { Book } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<CSPPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Sync with URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    setSearchQuery(search);
    setSelectedCategory(category);
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch books from CSP API
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const params: { page: number; per_page: number; search?: string; category?: string } = {
          page: currentPage,
          per_page: 20,
        };
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== "all") params.category = selectedCategory;

        const result = await fetchBooks(params);
        setBooks(result.books);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [searchQuery, selectedCategory, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page");
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
    params.delete("page");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      <main className="px-6 md:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Search Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-serif text-foreground mb-6 pb-3 border-b-2 border-foreground/20">Search</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pr-12 h-12 border-border bg-background text-base"
                />
                <button className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center bg-muted/50 border-l border-border hover:bg-muted transition-colors">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Category filter info */}
            <div>
              <h3 className="text-2xl font-serif text-foreground mb-6 pb-3 border-b-2 border-foreground/20">
                Subject Categories
              </h3>
              {selectedCategory !== "all" && (
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">Filtering by: </span>
                  <span className="text-sm font-medium text-foreground">{selectedCategory}</span>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="ml-2 text-xs text-accent hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
              {pagination && (
                <p className="text-sm text-muted-foreground">
                  Showing {books.length} of {pagination.total} books
                </p>
              )}
            </div>
          </aside>

          {/* Books List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-3 text-muted-foreground">Loading books...</span>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-serif text-foreground mb-2">No books found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {books.map((book) => (
                    <article key={book.id} className="py-10 first:pt-0">
                      <div className="flex flex-col md:flex-row gap-10">
                        {/* Book Cover */}
                        <Link to={`/books/${book.id}`} className="flex-shrink-0 w-full md:w-56">
                          <div className="aspect-[2/3] overflow-hidden shadow-xl">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        </Link>

                        {/* Book Details */}
                        <div className="flex-1 flex flex-col justify-center">
                          <Link to={`/books/${book.id}`}>
                            <h2 className="font-serif text-foreground hover:text-[#E4573D] transition-colors leading-tight text-xl">
                              {book.title}
                            </h2>
                          </Link>

                          {book.description && (
                            <p className="text-xl italic mt-3 leading-snug text-black">
                              {book.description.length > 80
                                ? book.description.substring(0, 80) + "..."
                                : book.description}
                            </p>
                          )}

                          <p className="text-lg text-muted-foreground mt-4">
                            By: <span className="text-muted-foreground">{book.author}</span>
                          </p>

                          {book.blurb && (
                            <p className="text-base text-muted-foreground mt-5 leading-relaxed line-clamp-4">
                              {book.blurb}
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
                                  addToWishlist(book);
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

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {pagination.page} of {pagination.total_pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= pagination.total_pages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
