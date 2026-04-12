/**
 * Cambridge Scholars Publishing API Service
 * Base URL: https://api.cambridgescholars.com/api/website
 */

import { Book, BookFormatInfo } from "@/contexts/CartContext";

const CSP_API_BASE = "https://api.cambridgescholars.com/api/website";

// Raw API response types
export interface CSPBookRaw {
  bookname: string;
  bookcategory: string | null;
  authors: Array<{ name: string; role: string }> | string | null;
  editors: Array<{ name: string; role: string }> | string | null;
  contributors: Array<{ name: string; role: string }> | string | null;
  
  authorbiography: string | null;
  bookdescription: string | null;
  short_blurb: string | null;
  praise: string | null;
  bookimage: string;
  booksample: string;
  booktype: string;
  "Hardback:ISBN": string | null;
  "Hardback:ISBN13": string | null;
  "Hardback:ReleaseDate": string | null;
  "Hardback:Pages": number | null;
  "Hardback:Price": string | null;
  "Paperback:ISBN": string | null;
  "Paperback:ISBN13": string | null;
  "Paperback:ReleaseDate": string | null;
  "Paperback:Pages": number | null;
  "Paperback:Price": string | null;
  "Ebook:ISBN": string | null;
  "Ebook:ISBN10": string | null;
  bic1: string | null;
  bic2: string | null;
  bic3: string | null;
  bisac1: string | null;
  bisac2: string | null;
  bisac3: string | null;
  bisac4: string | null;
  bisac5: string | null;
  bisac6: string | null;
  thema1: string | null;
  thema2: string | null;
  thema3: string | null;
  thema4: string | null;
  thema5: string | null;
  thema6: string | null;
  qual1: string | null;
  qual2: string | null;
  qual3: string | null;
  qual4: string | null;
  qual5: string | null;
  qual6: string | null;
}

export interface CSPPagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CSPBookListResponse {
  data: CSPBookRaw[];
  pagination: CSPPagination;
}

// Transform raw API book to our Book type
function transformBook(raw: CSPBookRaw): Book {
  const isbn13 = raw["Hardback:ISBN13"] || raw["Paperback:ISBN13"] || raw["Ebook:ISBN"] || "";
  const id = isbn13 || raw.bookname; // Use ISBN13 as ID

  const hardbackPrice = raw["Hardback:Price"] ? parseFloat(raw["Hardback:Price"]) : null;
  const paperbackPrice = raw["Paperback:Price"] ? parseFloat(raw["Paperback:Price"]) : null;
  const price = hardbackPrice || paperbackPrice || 0;

  const extractNames = (field: Array<{ name: string; role: string }> | string | null): string | null => {
    if (!field) return null;
    if (typeof field === 'string') return field;
    if (Array.isArray(field)) return field.map(a => a.name).join(', ');
    return null;
  };
  const author = extractNames(raw.authors) || extractNames(raw.editors) || extractNames(raw.contributors) || "Unknown";

  // Parse categories from bookcategory string like "Education : Science Education : STEM"
  const categories = raw.bookcategory
    ? raw.bookcategory.split(" : ").map((c) => c.trim())
    : [];

  // Collect non-null subject codes
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
    title: raw.bookname,
    author,
    price,
    image: raw.bookimage,
    rating: 0,
    category: categories[0] || "General",
    description: raw.short_blurb?.trim() || raw.bookdescription?.trim() || undefined,
    isbn: isbn13,
    pages: raw["Hardback:Pages"] || raw["Paperback:Pages"] || undefined,
    publisher: "Cambridge Scholars Publishing",
    publishDate: raw["Hardback:ReleaseDate"] || raw["Paperback:ReleaseDate"] || undefined,
    blurb: raw.bookdescription?.trim() || undefined,
    biography: raw.authorbiography?.trim() || undefined,
    hardbackInfo,
    paperbackInfo,
    ebookInfo,
    categories,
    subjectCodes: bic.length || bisac.length || thema.length
      ? { bic, bisac, thema }
      : undefined,
    samplePdfUrl: raw.booksample || undefined,
    // Store extra pricing for format selection
    _hardbackPrice: hardbackPrice,
    _paperbackPrice: paperbackPrice,
    _praise: raw.praise || undefined,
  } as Book & { _hardbackPrice?: number | null; _paperbackPrice?: number | null; _praise?: string };
}

// Fetch paginated book list
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
  const data: CSPBookListResponse = await res.json();

  return {
    books: data.data.map(transformBook),
    pagination: data.pagination,
  };
}

// Fetch a single book by ISBN
export async function fetchBookByIsbn(isbn: string): Promise<Book | null> {
  const res = await fetch(`${CSP_API_BASE}/books/${encodeURIComponent(isbn)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data: CSPBookRaw = await res.json();
  return transformBook(data);
}
