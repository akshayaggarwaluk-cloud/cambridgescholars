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
  full_description?: string | null;
  short_description?: string | null;
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
  subject_codes?: {
    bic?: string[] | null;
    bisac?: string[] | null;
    thema?: string[] | null;
  } | null;
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
    description: raw.subtitle || raw.full_description?.trim() || raw.description?.trim() || undefined,
    isbn: raw.isbn,
    pages: raw.pages || hardback?.pages || paperback?.pages || undefined,
    publisher: "Cambridge Scholars Publishing",
    publishDate: raw.publication_date || hardback?.publication_date || paperback?.publication_date || undefined,
    blurb: raw.full_description?.trim() || raw.description?.trim() || undefined,
    biography: raw.author_biography?.trim() || undefined,
    shortDescription: raw.short_description?.trim() || undefined,
    hardbackInfo: buildFormatInfo(hardback),
    paperbackInfo: buildFormatInfo(paperback),
    ebookInfo: buildFormatInfo(ebook),
    categories,
    samplePdfUrl: raw.sample_pdf || undefined,
    apiReviews: apiReviews.length > 0 ? apiReviews : undefined,
    recommendedBooks: recommendedBooks.length > 0 ? recommendedBooks : undefined,
    series,
    subjectCodes: raw.subject_codes
      ? {
          bic: raw.subject_codes.bic || undefined,
          bisac: raw.subject_codes.bisac || undefined,
          thema: raw.subject_codes.thema || undefined,
        }
      : undefined,
    _hardbackPrice: hardback?.price_gbp ?? null,
    _paperbackPrice: paperback?.price_gbp ?? null,
    _ebookPrice: ebook?.price_gbp ?? null,
  } as Book & { _hardbackPrice?: number | null; _paperbackPrice?: number | null; _ebookPrice?: number | null };
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
    _ebookPrice: null,
    _praise: raw.praise || undefined,
  } as Book & { _hardbackPrice?: number | null; _paperbackPrice?: number | null; _ebookPrice?: number | null; _praise?: string };
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
  orderby?: string;
  order?: string;
  series?: string;
  format?: "hardback" | "paperback" | "ebook";
  sort?:
    | "best_selling"
    | "date_new_old"
    | "date_old_new"
    | "price_low_high"
    | "price_high_low"
    | "latest"
    | "oldest"
    | "title_az"
    | "featured";
  has_cover?: boolean;
}): Promise<{ books: Book[]; pagination: CSPPagination; requestUrl: string }> {
  const url = new URL(`${CSP_API_BASE}/books`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.per_page) url.searchParams.set("per_page", String(params.per_page));
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.search_field) url.searchParams.set("search_field", params.search_field);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.isbn) url.searchParams.set("isbn", params.isbn);
  if (params?.orderby) url.searchParams.set("orderby", params.orderby);
  if (params?.order) url.searchParams.set("order", params.order);
  if (params?.series) url.searchParams.set("series", params.series);
  if (params?.format) url.searchParams.set("format", params.format);
  if (params?.sort) url.searchParams.set("sort", params.sort);
  if (params?.has_cover !== undefined) url.searchParams.set("has_cover", String(params.has_cover));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  // Handle both response shapes: { data: [...], pagination } and { books: [...], pagination }
  const rawBooks: CSPBookRaw[] = json.data || json.books || [];
  const rawPag = json.pagination || {};
  const pagination: CSPPagination = {
    total: rawPag.total ?? rawPag.total_items ?? rawBooks.length,
    page: rawPag.page ?? rawPag.current_page ?? 1,
    per_page: rawPag.per_page ?? rawBooks.length,
    total_pages: rawPag.total_pages ?? 1,
  };

  return {
    books: rawBooks.map(transformBook),
    pagination,
    requestUrl: url.toString(),
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
  const data = json.data || [];
  // Normalize new API shape ({ author_name, author_bio, quote, category })
  // back into the legacy shape consumers expect ({ author, praise, date }).
  return data.map((r: Record<string, unknown>) => {
    const name = (r.author_name as string) || (r.author as string) || "";
    const bio = (r.author_bio as string) || "";
    const author = name && bio ? `${name} – ${bio}` : name || bio || (r.author as string) || "";
    return {
      author,
      book_title: (r.book_title as string) || "",
      praise: (r.quote as string) || (r.praise as string) || "",
      date: (r.date as string) || "",
    };
  });
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

// ─── Series ─────────────────────────────────────────────────────

export interface CSPSeriesSummary {
  id: number | string;
  title: string;
  slug: string;
  book_count?: number;
  description?: string | null;
}

export interface CSPSeriesListResponse {
  series: CSPSeriesSummary[];
  alphabet_counts?: Record<string, number>;
  pagination?: CSPPagination;
}

export interface CSPSeriesDetail extends CSPSeriesSummary {
  books?: CSPBookRaw[];
}

/** List all book series (A-Z, with per-letter counts) */
export async function fetchSeriesList(params?: {
  letter?: string;
  page?: number;
  per_page?: number;
}): Promise<CSPSeriesListResponse> {
  const url = new URL(`${CSP_API_BASE}/series`);
  if (params?.letter) url.searchParams.set("letter", params.letter);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.per_page) url.searchParams.set("per_page", String(params.per_page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return {
    series: json.data || json.series || [],
    alphabet_counts: json.alphabet_counts,
    pagination: json.pagination,
  };
}

/** Get a single series with its books */
export async function fetchSeriesDetail(idOrSlug: string): Promise<CSPSeriesDetail | null> {
  const res = await fetch(`${CSP_API_BASE}/series/${encodeURIComponent(idOrSlug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || json;
}

// ─── Newsletter ─────────────────────────────────────────────────

export interface NewsletterSubscribeResponse {
  message: string;
  subscribed?: boolean;
}

/** Subscribe an email address to the CSP mailing list. */
export async function subscribeNewsletter(
  email: string,
  extras?: { first_name?: string; last_name?: string },
): Promise<NewsletterSubscribeResponse> {
  const res = await fetch(`${CSP_API_BASE}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, ...(extras || {}) }),
  });
  const text = await res.text();
  let parsed: NewsletterSubscribeResponse | { error?: string; detail?: string; message?: string } = {} as NewsletterSubscribeResponse;
  try { parsed = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
  if (!res.ok) {
    const msg = (parsed as { error?: string; detail?: string; message?: string })?.error
      || (parsed as { detail?: string })?.detail
      || (parsed as { message?: string })?.message
      || `Subscription failed (${res.status})`;
    throw new Error(msg);
  }
  return parsed as NewsletterSubscribeResponse;
}

// ─── System ─────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  uptime?: number;
  version?: string;
}

/** Health check (uptime / version). */
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`https://api.cambridgescholars.com/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// ─── Site statistics ────────────────────────────────────────────

export interface SiteStatistics {
  total_titles?: number;
  total_pages?: number;
  books_last_12_months?: number;
  countries?: number;
  [key: string]: number | string | undefined;
}

/** Site-wide aggregate statistics for the homepage. */
export async function fetchSiteStatistics(): Promise<SiteStatistics> {
  const res = await fetch(`${CSP_API_BASE}/homepage/statistics`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || json;
}

// ─── Submissions ────────────────────────────────────────────────

export interface ProposalAuthor {
  role: "author" | "co-author" | "editor" | "contributor" | "translator";
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  institution?: string;
  country?: string;
  biography?: string;
  cv?: string;
}

export interface ProposalPayload {
  authors: ProposalAuthor[];
  mailing: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  book: {
    title: string;
    subtitle?: string;
    type: "monograph" | "edited_collection";
    subject: string;
    secondarySubjects?: string[];
    language: string;
    estimatedWordCount: number;
    estimatedPages?: number;
    estimatedCompletionDate: string;
    isPreviouslyPublished: boolean;
    hasIllustrations: boolean;
    illustrationCount?: number;
    hasTables: boolean;
  };
  description: {
    abstract: string;
    tableOfContents?: string;
    keyFeatures: string;
    uniqueSellingPoints: string;
  };
  marketing: {
    targetAudience: string;
    primaryMarket?: string;
    competingTitles: string;
    recommendedReviewers?: string;
    conferences?: string;
    promotionalChannels?: string;
  };
  manuscript: {
    sampleChapter?: string;
    fullManuscript?: string;
    additionalFiles?: string[];
  };
  agreement: {
    acceptedTerms: boolean;
    acceptedPrivacyPolicy: boolean;
    signedBy: string;
    signedAt: string;
  };
}

export interface ProposalSubmitResponse {
  success: boolean;
  data?: {
    submissionId: string;
    referenceNumber: string;
    submittedAt: string;
    status: string;
    estimatedReviewTime?: string;
  };
  message?: string;
  error?: string;
  details?: Record<string, string>;
}

/** Submit a book proposal (multipart/form-data). */
export async function submitProposal(
  payload: ProposalPayload,
  files: { cv?: File | null; sampleChapters?: File[]; additionalFiles?: File[] },
): Promise<ProposalSubmitResponse> {
  const fd = new FormData();
  // Backend expects `authors` as a repeated multipart array field — one entry per author.
  payload.authors.forEach((a) => fd.append("authors", JSON.stringify(a)));
  fd.append("mailing", JSON.stringify(payload.mailing));
  fd.append("book", JSON.stringify(payload.book));
  fd.append("description", JSON.stringify(payload.description));
  fd.append("marketing", JSON.stringify(payload.marketing));
  fd.append("manuscript", JSON.stringify(payload.manuscript));
  fd.append("agreement", JSON.stringify(payload.agreement));

  if (files.cv) fd.append("cv", files.cv);
  (files.sampleChapters || []).forEach((f) => fd.append("sampleChapter", f));
  (files.additionalFiles || []).forEach((f) => fd.append("additionalFiles", f));

  const res = await fetch(`${CSP_API_BASE}/submissions/proposal`, {
    method: "POST",
    body: fd,
  });
  const text = await res.text();
  let parsed: ProposalSubmitResponse = { success: false };
  try { parsed = text ? JSON.parse(text) : { success: false }; } catch { /* ignore */ }
  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many submissions. Please try again in an hour.");
    if (res.status === 413) throw new Error(parsed.message || "One or more files are too large.");
    if (res.status === 400 && parsed.details) {
      const first = Object.values(parsed.details)[0];
      throw new Error(first || "Please review the form for errors.");
    }
    throw new Error(parsed.message || parsed.error || `Submission failed (${res.status})`);
  }
  return parsed;
}

// ---------------- Contact ----------------
export interface ContactSubmitPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
  honeypot?: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  message?: string;
  ticketId?: string;
  error?: string;
  details?: Record<string, string>;
}

export async function fetchContactSubjects(): Promise<string[]> {
  try {
    const res = await fetch(`${CSP_API_BASE}/contact/subjects`);
    if (!res.ok) return ["Proposals", "Mailing", "Queries"];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : ["Proposals", "Mailing", "Queries"];
  } catch {
    return ["Proposals", "Mailing", "Queries"];
  }
}

export async function submitContactMessage(
  payload: ContactSubmitPayload,
): Promise<ContactSubmitResponse> {
  const res = await fetch(`${CSP_API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ honeypot: "", ...payload }),
  });
  const text = await res.text();
  let parsed: ContactSubmitResponse = { success: false };
  try { parsed = text ? JSON.parse(text) : { success: false }; } catch { /* ignore */ }
  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many requests. Please try again later.");
    if (res.status === 400) {
      if (parsed.details) {
        const first = Object.values(parsed.details)[0];
        if (first) throw new Error(first);
      }
      throw new Error(parsed.message || "Invalid request. Please check the form.");
    }
    throw new Error(parsed.message || parsed.error || `Submission failed (${res.status})`);
  }
  return parsed;
}
