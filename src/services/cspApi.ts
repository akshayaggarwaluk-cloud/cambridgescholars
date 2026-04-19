/**
 * Cambridge Scholars Publishing API Service
 * Base URL: https://api.cambridgescholars.com/api/website
 */

import { Book, BookFormatInfo, APIReview, RecommendedBook } from "@/contexts/CartContext";

const CSP_API_BASE = "https://api.cambridgescholars.com/api/website";

// ─── Raw API response types (matching actual API) ───

interface CSPAuthorRaw {
  name: string;
  role: string; // "author" | "editor" | "contributor"
}

interface CSPCategoryRaw {
  name: string;
  slug: string;
}

interface CSPFormatRaw {
  type: string; // "hardback" | "paperback" | "ebook"
  available: boolean;
  isbn: string | null;
  isbn10: string | null;
  pages: number | null;
  price_gbp: number | null;
  price_usd: number | null;
  price_eur: number | null;
  publication_date: string | null;
}

interface CSPReviewRaw {
  reviewer: string;
  reviewer_position: string;
  review: string;
  date: string;
}

interface CSPSeriesRaw {
  title: string;
  slug: string;
  volume?: string;
}

export interface CSPBookRaw {
  title: string;
  subtitle: string | null;
  slug: string;
  isbn: string;
  description: string | null;
  cover_image: string;
  sample_pdf: string | null;
  pages: number | null;
  publication_date: string | null;
  is_featured: boolean;
  is_editors_choice: boolean;
  series: CSPSeriesRaw | string | null;
  authors: CSPAuthorRaw[];
  categories: {
    level_1: CSPCategoryRaw | null;
    level_2: CSPCategoryRaw | null;
    level_3: CSPCategoryRaw | null;
  };
  formats: CSPFormatRaw[];
  author_biography?: string | null;
  reviews?: CSPReviewRaw[];
  recommended_books?: CSPBookRaw[];
  featured_reviewer?: {
    name: string;
    position: string;
    score: number;
    rationale: string;
  } | null;

  // Legacy flat fields (from old single-book endpoint)
  bookname?: string;
  bookcategory?: string;
  bookdescription?: string;
  short_blurb?: string;
  praise?: string;
  authorbiography?: string;
  bookimage?: string;
  booksample?: string;
  booktype?: string;
  resourceid?: string;
  "Hardback:ISBN"?: string | null;
  "Hardback:ISBN13"?: string | null;
  "Hardback:ReleaseDate"?: string | null;
  "Hardback:Pages"?: number | null;
  "Hardback:Price"?: number | null;
  "Paperback:ISBN"?: string | null;
  "Paperback:ISBN13"?: string | null;
  "Paperback:ReleaseDate"?: string | null;
  "Paperback:Pages"?: number | null;
  "Paperback:Price"?: number | null;
  "Ebook:ISBN"?: string | null;
  "Ebook:ISBN10"?: string | null;
  bic1?: string | null;
  bic2?: string | null;
  bic3?: string | null;
  bisac1?: string | null;
  bisac2?: string | null;
  bisac3?: string | null;
  bisac4?: string | null;
  bisac5?: string | null;
  bisac6?: string | null;
  thema1?: string | null;
  thema2?: string | null;
  thema3?: string | null;
  thema4?: string | null;
  thema5?: string | null;
  thema6?: string | null;
  qual1?: string | null;
  qual2?: string | null;
  qual3?: string | null;
  qual4?: string | null;
  qual5?: string | null;
  qual6?: string | null;
}

export interface CSPPagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── Transform helpers ───

function getFormat(formats: CSPFormatRaw[] | undefined, type: string): CSPFormatRaw | undefined {
  return formats?.find((f) => f.type === type);
}

function buildFormatInfo(fmt: CSPFormatRaw | undefined): BookFormatInfo | undefined {
  if (!fmt) return undefined;
  return {
    isbn: fmt.isbn10 || undefined,
    isbn13: fmt.isbn || undefined,
    publicationDate: fmt.publication_date || undefined,
  };
}

/**
 * Transform a book from the new list API format (nested authors/categories/formats).
 */
function transformNewBook(raw: CSPBookRaw): Book {
  const hardback = getFormat(raw.formats, "hardback");
  const paperback = getFormat(raw.formats, "paperback");
  const ebook = getFormat(raw.formats, "ebook");

  const price = hardback?.price_gbp ?? paperback?.price_gbp ?? 0;

  // Build author string
  const authorNames = raw.authors?.map((a) => a.name).join(", ") || "Unknown";

  // Build categories array
  const categories: string[] = [];
  if (raw.categories?.level_1?.name) categories.push(raw.categories.level_1.name);
  if (raw.categories?.level_2?.name) categories.push(raw.categories.level_2.name);
  if (raw.categories?.level_3?.name) categories.push(raw.categories.level_3.name);

  // Parse series
  const series = raw.series && typeof raw.series === 'object'
    ? raw.series as { title: string; slug: string; volume?: string }
    : null;

  // Parse API reviews
  const apiReviews: APIReview[] = (raw.reviews || []).map((r) => ({
    reviewer: r.reviewer,
    reviewer_position: r.reviewer_position,
    review: r.review,
    date: r.date,
  }));

  // Parse recommended books
  const recommendedBooks: RecommendedBook[] = (raw.recommended_books || []).map((rb) => ({
    isbn: rb.isbn,
    title: rb.title,
    subtitle: rb.subtitle,
    slug: rb.slug,
    cover_image: rb.cover_image,
    authors: rb.authors || [],
    formats: (rb.formats || []).map((f) => ({ type: f.type, price_gbp: f.price_gbp })),
  }));

  return {
    id: raw.isbn || raw.slug,
    title: raw.title,
    subtitle: raw.subtitle || undefined,
    author: authorNames,
    price,
    image: raw.cover_image,
    rating: 0,
    category: categories[0] || "General",
    description: raw.subtitle || raw.description || undefined,
    isbn: raw.isbn,
    pages: raw.pages || hardback?.pages || paperback?.pages || undefined,
    publisher: "Cambridge Scholars Publishing",
    publishDate: raw.publication_date || hardback?.publication_date || paperback?.publication_date || undefined,
    blurb: raw.description || undefined,
    biography: raw.author_biography?.trim() || undefined,
    hardbackInfo: buildFormatInfo(hardback),
    paperbackInfo: buildFormatInfo(paperback),
    ebookInfo: buildFormatInfo(ebook),
    categories,
    samplePdfUrl: raw.sample_pdf || undefined,
    apiReviews: apiReviews.length > 0 ? apiReviews : undefined,
    recommendedBooks: recommendedBooks.length > 0 ? recommendedBooks : undefined,
    series,
    _hardbackPrice: hardback?.price_gbp ?? null,
    _paperbackPrice: paperback?.price_gbp ?? null,
  } as Book & { _hardbackPrice?: number | null; _paperbackPrice?: number | null };
}

/**
 * Transform a book from the legacy single-book API format (flat fields).
 */
function transformLegacyBook(raw: CSPBookRaw): Book {
  const isbn13 = raw["Hardback:ISBN13"] || raw["Paperback:ISBN13"] || raw["Ebook:ISBN"] || "";
  const id = isbn13 || raw.bookname || raw.title;

  const hardbackPrice = raw["Hardback:Price"] ? parseFloat(String(raw["Hardback:Price"])) : null;
  const paperbackPrice = raw["Paperback:Price"] ? parseFloat(String(raw["Paperback:Price"])) : null;
  const price = hardbackPrice || paperbackPrice || 0;

  const author = (raw.authors && Array.isArray(raw.authors))
    ? raw.authors.map((a: CSPAuthorRaw) => a.name).join(", ")
    : (typeof raw.authors === "string" ? raw.authors : "Unknown");

  const categories = raw.bookcategory
    ? raw.bookcategory.split(" : ").map((c) => c.trim())
    : [];

  const bic = [raw.bic1, raw.bic2, raw.bic3].filter(Boolean) as string[];
  const bisac = [raw.bisac1, raw.bisac2, raw.bisac3, raw.bisac4, raw.bisac5, raw.bisac6].filter(Boolean) as string[];
  const thema = [raw.thema1, raw.thema2, raw.thema3, raw.thema4, raw.thema5, raw.thema6].filter(Boolean) as string[];

  const hardbackInfo: BookFormatInfo | undefined =
    raw["Hardback:ISBN"] || raw["Hardback:ISBN13"]
      ? {
          isbn: raw["Hardback:ISBN"] || undefined,
          isbn13: raw["Hardback:ISBN13"] || undefined,
          publicationDate: raw["Hardback:ReleaseDate"] || undefined,
        }
      : undefined;

  const paperbackInfo: BookFormatInfo | undefined =
    raw["Paperback:ISBN"] || raw["Paperback:ISBN13"]
      ? {
          isbn: raw["Paperback:ISBN"] || undefined,
          isbn13: raw["Paperback:ISBN13"] || undefined,
          publicationDate: raw["Paperback:ReleaseDate"] || undefined,
        }
      : undefined;

  const ebookInfo: BookFormatInfo | undefined =
    raw["Ebook:ISBN"]
      ? {
          isbn: raw["Ebook:ISBN10"] || undefined,
          isbn13: raw["Ebook:ISBN"] || undefined,
        }
      : undefined;

  return {
    id,
    title: raw.bookname || raw.title,
    author,
    price,
    image: raw.bookimage || raw.cover_image,
    rating: 0,
    category: categories[0] || "General",
    description: raw.short_blurb?.trim() || raw.bookdescription?.trim() || raw.description || undefined,
    isbn: isbn13 || raw.isbn,
    pages: raw["Hardback:Pages"] || raw["Paperback:Pages"] || raw.pages || undefined,
    publisher: "Cambridge Scholars Publishing",
    publishDate: raw["Hardback:ReleaseDate"] || raw["Paperback:ReleaseDate"] || raw.publication_date || undefined,
    blurb: raw.bookdescription?.trim() || raw.description || undefined,
    biography: raw.authorbiography?.trim() || undefined,
    hardbackInfo,
    paperbackInfo,
    ebookInfo,
    categories,
    subjectCodes: bic.length || bisac.length || thema.length
      ? { bic, bisac, thema }
      : undefined,
    samplePdfUrl: raw.booksample || raw.sample_pdf || undefined,
    _hardbackPrice: hardbackPrice,
    _paperbackPrice: paperbackPrice,
    _praise: raw.praise || undefined,
  } as Book & { _hardbackPrice?: number | null; _paperbackPrice?: number | null; _praise?: string };
}

/**
 * Detect format and transform accordingly.
 */
function transformBook(raw: CSPBookRaw): Book {
  // New API format has formats array; legacy has flat Hardback:* fields
  if (raw.formats && Array.isArray(raw.formats)) {
    return transformNewBook(raw);
  }
  return transformLegacyBook(raw);
}

// ─── API functions ───

/** Fetch paginated book list */
export async function fetchBooks(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  search_field?: string;
  category?: string;
  isbn?: string;
}): Promise<{ books: Book[]; pagination: CSPPagination }> {
  const url = new URL(`${CSP_API_BASE}/books`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.per_page) url.searchParams.set("per_page", String(params.per_page));
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.search_field) url.searchParams.set("search_field", params.search_field);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.isbn) url.searchParams.set("isbn", params.isbn);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  // Handle both response shapes: { data: [...], pagination } and { books: [...], pagination }
  const rawBooks: CSPBookRaw[] = json.data || json.books || [];
  const pagination: CSPPagination = json.pagination || {
    total: rawBooks.length,
    page: 1,
    per_page: rawBooks.length,
    total_pages: 1,
  };

  return {
    books: rawBooks.map(transformBook),
    pagination,
  };
}

/** Fetch featured reviews for homepage hero carousel */
export async function fetchFeaturedReviews(): Promise<{
  id: number;
  book_title: string;
  isbn: string;
  cover_image: string;
  review: string;
  reviewer: string;
  link?: string;
}[]> {
  const res = await fetch(`${CSP_API_BASE}/homepage/featured-reviews`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

/** Fetch featured books for homepage (ranked by author + reviewer scores) */
export async function fetchFeaturedBooks(): Promise<CSPBookRaw[]> {
  const res = await fetch(`${CSP_API_BASE}/homepage/featured-books`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

/** Fetch author testimonials for homepage */
export async function fetchAuthorReviews(): Promise<{
  author: string;
  book_title: string;
  praise: string;
  date: string;
}[]> {
  const res = await fetch(`${CSP_API_BASE}/homepage/author-reviews`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

/** Fetch a single book by ISBN */
export async function fetchBookByIsbn(isbn: string): Promise<Book | null> {
  const res = await fetch(`${CSP_API_BASE}/books/${encodeURIComponent(isbn)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  // Handle both { data: { ... } } and flat { ... } response shapes
  const raw: CSPBookRaw = json.data || json;
  return transformBook(raw);
}

/** Autocomplete search (up to 8 results) */
export async function fetchAutocomplete(q: string): Promise<{
  title: string;
  isbn: string;
  slug: string;
  authors: string;
  cover_image: string;
}[]> {
  if (q.length < 2) return [];
  const res = await fetch(`${CSP_API_BASE}/search/autocomplete?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

/** Category tree types */
export interface CSPCategory {
  name: string;
  slug: string;
  book_count: number;
  subcategories?: CSPCategory[];
}

/** Fetch full 3-level category tree */
export async function fetchCategories(): Promise<CSPCategory[]> {
  const res = await fetch(`${CSP_API_BASE}/categories`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

/** Forthcoming book type */
export interface CSPForthcomingBook {
  title: string;
  isbn: string;
  pub_date: string;
  binding: string;
  price_uk_gbp: number;
}

/** Fetch forthcoming titles */
export async function fetchForthcomingBooks(params?: {
  page?: number;
  per_page?: number;
}): Promise<{ books: CSPForthcomingBook[]; pagination: CSPPagination }> {
  const url = new URL(`${CSP_API_BASE}/books/forthcoming`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.per_page) url.searchParams.set("per_page", String(params.per_page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  const pagination: CSPPagination = json.pagination ? {
    total: json.pagination.total_items,
    page: json.pagination.current_page,
    per_page: json.pagination.per_page,
    total_pages: json.pagination.total_pages,
  } : { total: 0, page: 1, per_page: 20, total_pages: 0 };

  return { books: json.data || [], pagination };
}
