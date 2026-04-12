/**
 * Cambridge Scholars Publishing API Service
 * Base URL: https://api.cambridgescholars.com/api/website
 */

import { Book, BookFormatInfo } from "@/contexts/CartContext";

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
  series: string | null;
  authors: CSPAuthorRaw[];
  categories: {
    level_1: CSPCategoryRaw | null;
    level_2: CSPCategoryRaw | null;
    level_3: CSPCategoryRaw | null;
  };
  formats: CSPFormatRaw[];

  // Legacy flat fields (from single-book endpoint)
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

  return {
    id: raw.isbn || raw.slug,
    title: raw.title,
    author: authorNames,
    price,
    image: raw.cover_image,
    rating: 0,
    category: categories[0] || "General",
    description: raw.description || undefined,
    isbn: raw.isbn,
    pages: raw.pages || hardback?.pages || paperback?.pages || undefined,
    publisher: "Cambridge Scholars Publishing",
    publishDate: raw.publication_date || hardback?.publication_date || paperback?.publication_date || undefined,
    blurb: raw.description || undefined,
    biography: undefined, // Not in list response
    hardbackInfo: buildFormatInfo(hardback),
    paperbackInfo: buildFormatInfo(paperback),
    ebookInfo: buildFormatInfo(ebook),
    categories,
    samplePdfUrl: raw.sample_pdf || undefined,
    // Extra pricing for format selection
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
  category?: string;
  isbn?: string;
}): Promise<{ books: Book[]; pagination: CSPPagination }> {
  const url = new URL(`${CSP_API_BASE}/books`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.per_page) url.searchParams.set("per_page", String(params.per_page));
  if (params?.search) url.searchParams.set("search", params.search);
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

/** Fetch a single book by ISBN */
export async function fetchBookByIsbn(isbn: string): Promise<Book | null> {
  const res = await fetch(`${CSP_API_BASE}/books/${encodeURIComponent(isbn)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data: CSPBookRaw = await res.json();
  return transformBook(data);
}
