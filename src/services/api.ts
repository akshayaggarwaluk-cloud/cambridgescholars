/**
 * API type definitions
 *
 * Legacy mock-implementation functions have been removed in favor of the
 * dedicated services that call the CSP API directly:
 *   - src/services/cspApi.ts        — public catalog (books, categories, search…)
 *   - src/services/authService.ts   — auth (login, register, refresh, logout)
 *   - src/services/accountService.ts — profile, orders, wishlist, ebooks
 *
 * This file only retains the shared type interfaces still imported by data
 * files and a few legacy components.
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  categoryId?: string;
  description?: string;
  isbn?: string;
  pages?: number;
  publisher?: string;
  publishDate?: string;
  language?: string;
  format?: string[];
  tableOfContents?: string[];
  reviews?: Review[];
  inStock?: boolean;
  stockQuantity?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  bookCount: number;
  image?: string;
  parentId?: string;
  subcategories?: Category[];
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image: string;
  institution?: string;
  expertise?: string[];
  bookCount: number;
  books?: Book[];
  email?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    researchGate?: string;
  };
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  content?: string;
  createdAt: string;
  helpful?: number;
  verified?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  tags?: string[];
  featured?: boolean;
}

export interface ManuscriptSubmission {
  id?: string;
  title: string;
  authorName: string;
  email: string;
  phone?: string;
  institution?: string;
  category: string;
  synopsis: string;
  wordCount?: number;
  targetAudience?: string;
  previousPublications?: string;
  marketingPlan?: string;
  manuscriptFile?: File;
  status?: "pending" | "under_review" | "accepted" | "rejected";
  submittedAt?: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  preferences?: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  format: "ebook" | "hardbook";
}

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage?: string;
  quantity: number;
  price: number;
  format: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface WishlistItem {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage?: string;
  bookPrice: number;
  addedAt: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  format?: string;
  language?: string;
  sortBy?: "relevance" | "title" | "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
