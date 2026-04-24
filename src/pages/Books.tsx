import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronDown, Heart, Loader2, AlignLeft, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBooks, fetchCategories, CSPPagination, CSPCategory } from "@/services/cspApi";
import { Book } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

// Sort options matching the CSP API (`sort` query param)
type SortValue =
  | "best_selling"
  | "date_new_old"
  | "date_old_new"
  | "price_low_high"
  | "price_high_low";
const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "best_selling", label: "Best Selling" },
  { value: "date_new_old", label: "Date: New to Old" },
  { value: "date_old_new", label: "Date: Old to New" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [orderBy, setOrderBy] = useState<string>(searchParams.get("sort") || "best_selling");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<CSPPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [categories, setCategories] = useState<CSPCategory[]>([]);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [activeSearchField, setActiveSearchField] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        const order = ["Social Sciences", "Physical Sciences", "Health Science", "Health Sciences", "Life Sciences", "All Categories"];
        const sorted = [...cats].sort((a, b) => {
          const ai = order.indexOf(a.name);
          const bi = order.indexOf(b.name);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
        setCategories(sorted);
      })
      .catch(() => setCategories([]));
  }, []);

  // Sync with URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchField = searchParams.get("search_field") || "";
    const orderbyParam = searchParams.get("sort") || "best_selling";
    setSearchQuery(search);
    setSelectedCategory(category);
    setCurrentPage(page);
    setActiveSearchField(searchField);
    setOrderBy(orderbyParam);
  }, [searchParams]);

  // Find category name from slug (API expects name, not slug)
  const findCategoryName = (slug: string, cats: CSPCategory[]): string | null => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat.name;
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          if (sub.slug === slug) return sub.name;
          if (sub.subcategories) {
            for (const spec of sub.subcategories) {
              if (spec.slug === slug) return spec.name;
            }
          }
        }
      }
    }
    return null;
  };

  // Fetch books from CSP API
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const params: {
          page: number;
          per_page: number;
          search?: string;
          search_field?: string;
          category?: string;
          sort?:
            | "best_selling"
            | "date_new_old"
            | "date_old_new"
            | "price_low_high"
            | "price_high_low";
        } = {
          page: currentPage,
          per_page: 20,
        };
        if (searchQuery) params.search = searchQuery;
        if (activeSearchField) params.search_field = activeSearchField;
        if (selectedCategory !== "all") {
          const catName = findCategoryName(selectedCategory, categories);
          if (catName) params.category = catName;
          else params.category = selectedCategory;
        }
        // Send the CSP API `sort` value directly
        const sortDef = SORT_OPTIONS.find((s) => s.value === orderBy);
        if (sortDef) {
          params.sort = sortDef.value;
        }

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
  }, [searchQuery, selectedCategory, currentPage, categories, activeSearchField, orderBy]);

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

  const handleSortChange = (value: string) => {
    setOrderBy(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== "best_selling") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("orderby");
    params.delete("page");
    setSearchParams(params);
  };

  // Build a numbered page list with ellipses (1 … 4 5 6 … 20)
  const buildPageList = (current: number, total: number): (number | "…")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push("…");
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push("…");
    pages.push(total);
    return pages;
  };

  const resultsSummary =
    pagination && pagination.total != null && pagination.total > 0
      ? `Showing ${((pagination.page ?? 1) - 1) * (pagination.per_page ?? 0) + 1}–${Math.min(
          (pagination.page ?? 1) * (pagination.per_page ?? 0),
          pagination.total,
        )} of ${(pagination.total ?? 0).toLocaleString()} results`
      : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Bookshop</h1>
          <PageBreadcrumb currentPage="Bookshop" />
        </div>
      </div>

      <main className="px-6 md:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Top bar: results count + sort toggle — full-width above the columns */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <p className="italic text-[#ababab] text-sm font-medium" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {resultsSummary}
            </p>
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1 font-baskerville text-base text-[#333] hover:text-[#C75B2A] transition-colors"
              aria-expanded={sortOpen}
            >
              {sortOpen ? <X className="h-4 w-4" /> : <AlignLeft className="h-4 w-4" />}
                <span className="underline underline-offset-4 text-sm font-['Nunito_Sans'] text-[#696969] font-medium">Sort By</span>
            </button>
          </div>

          <div
            className={cn(
              "grid transition-all duration-500 ease-in-out overflow-hidden",
              sortOpen ? "grid-rows-[1fr] opacity-100 mb-12" : "grid-rows-[0fr] opacity-0 mb-0",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pb-2 border-b border-[#d9d9d9]">
                <h3 className="font-baskerville text-[20px] font-normal text-black">Sort By</h3>
              </div>
              <ul className="mt-7 space-y-5 pl-1">
                {SORT_OPTIONS.map((opt) => {
                  const active = orderBy === opt.value;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => {
                          handleSortChange(opt.value);
                          setSortOpen(false);
                        }}
                        className={cn(
                          "inline-block font-baskerville text-xs text-left transition-colors no-underline border-b border-transparent pb-px",
                           active ? "text-black border-black" : "text-[#696969]",
                        )}
                      >
                        {opt.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Search Section */}
            <div className="mb-10">
              <h3 className="font-baskerville text-[24px] font-normal text-[#333333] mb-4 pb-3 border-b border-[#E5E1D8]">Search</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pr-12 h-12 text-base border-white bg-[#f7f7f7]"
                />
                <button className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center border-l transition-colors border-white bg-[#f7f7f7]">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div>
              <h3 className="font-baskerville text-[24px] font-normal text-[#333333] mb-4 pb-3 border-b border-[#E5E1D8]">
                Subject Categories
              </h3>
              {categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((cat) => {
                    const isExpanded = expandedCats.has(cat.slug);
                    const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    return (
                      <li key={cat.slug}>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={cn("text-left font-baskerville text-sm py-2 transition-colors font-normal text-[#c4a273]")}
                          >
                            {cat.name}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#F1EFEA] rounded-full px-3 py-1 min-w-[44px] text-center font-baskerville text-xs text-[#c4a273]">
                              {cat.book_count}
                            </span>
                            <button
                              onClick={() => {
                                if (!hasSubs) return;
                                setExpandedCats((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(cat.slug)) next.delete(cat.slug);
                                  else next.add(cat.slug);
                                  return next;
                                });
                              }}
                              className={cn(
                                "p-0.5 w-5 h-5 flex items-center justify-center",
                                hasSubs ? "text-[#C5A374] hover:text-[#C75B2A]" : "invisible pointer-events-none",
                              )}
                              aria-hidden={!hasSubs}
                              tabIndex={hasSubs ? 0 : -1}
                            >
                              <ChevronDown
                                className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                              />
                            </button>
                          </div>
                        </div>
                        {/* Level 2 */}
                        {hasSubs && isExpanded && (
                          <ul className="ml-4 mt-1 space-y-0.5">
                            {cat.subcategories!.map((sub) => {
                              const isSubExpanded = expandedCats.has(sub.slug);
                              const hasSubSubs = sub.subcategories && sub.subcategories.length > 0;
                              return (
                                <li key={sub.slug}>
                                  <div className="flex items-center justify-between">
                                    <button
                                      onClick={() => handleCategoryChange(sub.slug)}
                                      className={cn(
                                        "text-left font-baskerville text-[14px] py-1.5 transition-colors",
                                        selectedCategory === sub.slug
                                          ? "text-[#C75B2A] font-normal"
                                          : "text-[#C5A374] hover:text-[#C75B2A] font-normal",
                                      )}
                                    >
                                      {sub.name}
                                    </button>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[12px] text-[#C5A374] bg-[#F1EFEA] rounded-full px-2.5 py-0.5 min-w-[40px] text-center font-baskerville">
                                        {sub.book_count}
                                      </span>
                                      {hasSubSubs && (
                                        <button
                                          onClick={() => {
                                            setExpandedCats((prev) => {
                                              const next = new Set(prev);
                                              if (next.has(sub.slug)) next.delete(sub.slug);
                                              else next.add(sub.slug);
                                              return next;
                                            });
                                          }}
                                          className="p-0.5 text-[#C5A374] hover:text-[#C75B2A]"
                                        >
                                          <ChevronDown
                                            className={cn(
                                              "h-3.5 w-3.5 transition-transform",
                                              isSubExpanded && "rotate-180",
                                            )}
                                          />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {/* Level 3 */}
                                  {hasSubSubs && isSubExpanded && (
                                    <ul className="ml-4 mt-0.5 space-y-0.5">
                                      {sub.subcategories!.map((spec) => (
                                        <li key={spec.slug}>
                                          <div className="flex items-center justify-between">
                                            <button
                                              onClick={() => handleCategoryChange(spec.slug)}
                                              className={cn(
                                                "text-left font-baskerville text-[14px] py-1 transition-colors",
                                                selectedCategory === spec.slug
                                                  ? "text-[#C75B2A] font-semibold"
                                                  : "text-[#C75B2A] hover:text-[#9c4521]",
                                              )}
                                            >
                                              {spec.name}
                                            </button>
                                            <span className="text-xs text-[#C75B2A] bg-[#F1EFEA] rounded-full px-2.5 py-0.5 min-w-[36px] text-center font-baskerville">
                                              {spec.book_count}
                                            </span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  {/* All Categories */}
                  <li>
                    <div className="flex items-center justify-between mt-2 pt-2">
                      <button
                        onClick={() => handleCategoryChange("all")}
                        className={cn("text-left font-baskerville text-sm py-2 transition-colors text-[#c4a273] font-normal")}
                      >
                        All Categories
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#F1EFEA] rounded-full px-3 py-1 min-w-[44px] text-center font-baskerville text-xs text-[#c4a273]">
                          {categories.reduce((sum, c) => sum + c.book_count, 0)}
                        </span>
                        <span className="w-5 h-5 invisible" aria-hidden="true" />
                      </div>
                    </div>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
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
                          <div className="aspect-[3/4] overflow-hidden shadow-xl">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Book Details */}
                        <div className="flex-1 flex flex-col">
                          <Link to={`/books/${book.id}`}>
                            <h2 className="font-['Libre_Baskerville'] text-foreground hover:text-[#E4573D] transition-colors leading-tight text-2xl font-medium">
                              {book.title}
                            </h2>
                          </Link>

                          {book.subtitle && (
                            <p className="font-['Libre_Baskerville'] text-xl italic mt-3 leading-snug text-black">
                              {book.subtitle}
                            </p>
                          )}

                          <p className="font-nav mt-4 text-[15px] text-[#333]">
                            By: <span>{book.author}</span>
                          </p>

                          {(book.shortDescription || book.blurb) && (
                            <p className="font-nav text-[15px] text-[#555] mt-5 leading-[1.7] whitespace-pre-line">
                              {book.shortDescription || book.blurb}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3 mt-auto pt-6">
                            <Button
                              asChild
                               className="bg-[#e4573d] hover:bg-[#e4573d]/80 text-white px-7 h-11 text-xs font-extrabold tracking-[0.18em] uppercase rounded-none transition-colors font-['Nunito_Sans']"
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
                                "h-11 w-11 rounded-none border border-[#E5E5E5] bg-white text-[#333] hover:bg-white hover:text-[#333] hover:border-black transition-colors",
                                isInWishlist(book.id) && "text-[#C75B2A] border-[#C75B2A]",
                              )}
                            >
                              <Heart className={cn("h-5 w-5", isInWishlist(book.id) && "fill-current")} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
          </div>

          {/* Pagination — centered across full container width */}
          {pagination && pagination.total_pages > 1 && !loading && books.length > 0 && (
            <nav
              className="flex items-center justify-center gap-5 mt-16 flex-wrap w-full"
              aria-label="Pagination"
            >
              {buildPageList(pagination.page, pagination.total_pages).map((p, idx) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="font-nav text-[18px] text-[#999]"
                  >
                    …
                  </span>
                ) : p === pagination.page ? (
                  <span
                    key={p}
                    aria-current="page"
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-nav text-[16px] font-semibold bg-[#e5573e]"
                  >
                    {p}
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className="font-nav text-[16px] transition-colors px-1 text-[#cccccc] font-semibold"
                  >
                    {p}
                  </button>
                ),
              )}
              {pagination.page < pagination.total_pages && (
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="font-nav text-[13px] font-bold tracking-[0.2em] uppercase transition-colors ml-2 text-[#999999] hover:text-[#C75B2A]"
                  aria-label="Next page"
                >
                  Next
                </button>
              )}
            </nav>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
