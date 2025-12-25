/**
 * API Service Layer
 * 
 * This file contains all API endpoint definitions and mock implementations.
 * Replace the mock implementations with actual API calls when backend is ready.
 * 
 * Each function is designed to match the expected API endpoint structure.
 */

import { supabase } from "@/integrations/supabase/client";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  price: number;
  originalPrice?: number;
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
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected';
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
  format: 'ebook' | 'hardbook';
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
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
  sortBy?: 'relevance' | 'title' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
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

// =============================================================================
// BOOKS API
// =============================================================================

/**
 * GET /api/books
 * Fetch all books with optional filters
 */
export async function getBooks(filters?: SearchFilters): Promise<PaginatedResponse<Book>> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/books?${new URLSearchParams(filters)}`);
  // return response.json();
  
  const { books } = await import('@/data/books');
  let filteredBooks = [...books];
  
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    filteredBooks = filteredBooks.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q)
    );
  }
  
  if (filters?.category && filters.category !== 'all') {
    filteredBooks = filteredBooks.filter(b => 
      b.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }
  
  return {
    data: filteredBooks,
    total: filteredBooks.length,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    totalPages: Math.ceil(filteredBooks.length / (filters?.limit || 20))
  };
}

/**
 * GET /api/books/:id
 * Fetch single book by ID
 */
export async function getBookById(id: string): Promise<Book | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/books/${id}`);
  // return response.json();
  
  const { books } = await import('@/data/books');
  return books.find(b => b.id === id) || null;
}

/**
 * GET /api/books/featured
 * Fetch featured books for homepage
 */
export async function getFeaturedBooks(): Promise<Book[]> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  return books.filter(b => b.rating >= 4.7).slice(0, 8);
}

/**
 * GET /api/books/bestsellers
 * Fetch bestselling books
 */
export async function getBestsellers(): Promise<Book[]> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  return books.sort((a, b) => b.rating - a.rating).slice(0, 8);
}

/**
 * GET /api/books/new-arrivals
 * Fetch recently added books
 */
export async function getNewArrivals(): Promise<Book[]> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  return books.slice(-8).reverse();
}

/**
 * GET /api/books/:id/related
 * Fetch related books based on category
 */
export async function getRelatedBooks(bookId: string): Promise<Book[]> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  const book = books.find(b => b.id === bookId);
  if (!book) return [];
  return books.filter(b => b.category === book.category && b.id !== bookId).slice(0, 4);
}

// =============================================================================
// CATEGORIES API
// =============================================================================

/**
 * GET /api/categories
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  // TODO: Replace with actual API call
  const { categories: categoriesData } = await import('@/data/categories');
  return categoriesData;
}

/**
 * GET /api/categories/:slug
 * Fetch single category with books
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // TODO: Replace with actual API call
  const { categories } = await import('@/data/categories');
  return categories.find(c => c.slug === slug) || null;
}

/**
 * GET /api/categories/:slug/books
 * Fetch books in a category
 */
export async function getBooksByCategory(slug: string, filters?: SearchFilters): Promise<PaginatedResponse<Book>> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  const filtered = books.filter(b => b.category.toLowerCase() === slug.toLowerCase());
  
  return {
    data: filtered,
    total: filtered.length,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    totalPages: Math.ceil(filtered.length / (filters?.limit || 20))
  };
}

// =============================================================================
// AUTHORS API
// =============================================================================

/**
 * GET /api/authors
 * Fetch all authors
 */
export async function getAuthors(): Promise<Author[]> {
  // TODO: Replace with actual API call
  const { authors } = await import('@/data/authors');
  return authors;
}

/**
 * GET /api/authors/featured
 * Fetch featured authors
 */
export async function getFeaturedAuthors(): Promise<Author[]> {
  // TODO: Replace with actual API call
  const { authors } = await import('@/data/authors');
  return authors.filter(a => a.bookCount >= 2).slice(0, 6);
}

/**
 * GET /api/authors/:slug
 * Fetch single author with their books
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  // TODO: Replace with actual API call
  const { authors } = await import('@/data/authors');
  return authors.find(a => a.slug === slug) || null;
}

/**
 * GET /api/authors/:slug/books
 * Fetch books by a specific author
 */
export async function getBooksByAuthor(authorSlug: string): Promise<Book[]> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  const { authors } = await import('@/data/authors');
  const author = authors.find(a => a.slug === authorSlug);
  if (!author) return [];
  return books.filter(b => b.author === author.name);
}

// =============================================================================
// SEARCH API
// =============================================================================

/**
 * GET /api/search
 * Global search across books, authors, categories
 */
export async function search(query: string): Promise<{
  books: Book[];
  authors: Author[];
  categories: Category[];
}> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  const { authors } = await import('@/data/authors');
  const { categories } = await import('@/data/categories');
  
  const q = query.toLowerCase();
  
  return {
    books: books.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q)
    ).slice(0, 5),
    authors: authors.filter(a => 
      a.name.toLowerCase().includes(q)
    ).slice(0, 3),
    categories: categories.filter(c => 
      c.name.toLowerCase().includes(q)
    ).slice(0, 3)
  };
}

/**
 * GET /api/search/autocomplete
 * Autocomplete suggestions for search
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  // TODO: Replace with actual API call
  const { books } = await import('@/data/books');
  const q = query.toLowerCase();
  
  const suggestions = new Set<string>();
  books.forEach(b => {
    if (b.title.toLowerCase().includes(q)) suggestions.add(b.title);
    if (b.author.toLowerCase().includes(q)) suggestions.add(b.author);
    if (b.category.toLowerCase().includes(q)) suggestions.add(b.category);
  });
  
  return Array.from(suggestions).slice(0, 8);
}

// =============================================================================
// REVIEWS API
// =============================================================================

/**
 * GET /api/books/:id/reviews
 * Fetch reviews for a book
 */
export async function getBookReviews(bookId: string): Promise<Review[]> {
  // TODO: Replace with actual API call
  // Uses Supabase directly for now
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });
  
  return (data || []).map(r => ({
    id: r.id,
    bookId: r.book_id,
    userId: r.user_id,
    userName: 'Reader', // Would come from profiles join
    rating: r.rating,
    title: r.title,
    content: r.content,
    createdAt: r.created_at,
  }));
}

/**
 * POST /api/books/:id/reviews
 * Submit a new review
 */
export async function submitReview(bookId: string, review: {
  rating: number;
  title?: string;
  content?: string;
}): Promise<Review | null> {
  // TODO: Replace with actual API call
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      book_id: bookId,
      user_id: user.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data ? {
    id: data.id,
    bookId: data.book_id,
    userId: data.user_id,
    userName: 'You',
    rating: data.rating,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
  } : null;
}

// =============================================================================
// NEWS/BLOG API
// =============================================================================

/**
 * GET /api/news
 * Fetch news articles
 */
export async function getNews(filters?: { category?: string; page?: number; limit?: number }): Promise<PaginatedResponse<NewsArticle>> {
  // TODO: Replace with actual API call
  const { newsArticles } = await import('@/data/news');
  let filtered = [...newsArticles];
  
  if (filters?.category) {
    filtered = filtered.filter(n => n.category === filters.category);
  }
  
  return {
    data: filtered,
    total: filtered.length,
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    totalPages: Math.ceil(filtered.length / (filters?.limit || 10))
  };
}

/**
 * GET /api/news/featured
 * Fetch featured news articles
 */
export async function getFeaturedNews(): Promise<NewsArticle[]> {
  // TODO: Replace with actual API call
  const { newsArticles } = await import('@/data/news');
  return newsArticles.filter(n => n.featured).slice(0, 3);
}

/**
 * GET /api/news/:slug
 * Fetch single news article
 */
export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  // TODO: Replace with actual API call
  const { newsArticles } = await import('@/data/news');
  return newsArticles.find(n => n.slug === slug) || null;
}

// =============================================================================
// MANUSCRIPT SUBMISSION API
// =============================================================================

/**
 * POST /api/manuscripts/submit
 * Submit a manuscript proposal
 */
export async function submitManuscript(submission: ManuscriptSubmission): Promise<{ success: boolean; id?: string; message: string }> {
  // TODO: Replace with actual API call
  // Would typically upload file to storage and save metadata to database
  
  console.log('Manuscript submission:', submission);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    id: `MS-${Date.now()}`,
    message: 'Your manuscript has been submitted successfully. We will review it and get back to you within 2-4 weeks.'
  };
}

/**
 * GET /api/manuscripts/status/:id
 * Check manuscript submission status
 */
export async function getManuscriptStatus(id: string): Promise<ManuscriptSubmission | null> {
  // TODO: Replace with actual API call
  return null;
}

// =============================================================================
// NEWSLETTER API
// =============================================================================

/**
 * POST /api/newsletter/subscribe
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(data: NewsletterSubscription): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  console.log('Newsletter subscription:', data);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: 'Thank you for subscribing! You will receive our latest updates.'
  };
}

/**
 * POST /api/newsletter/unsubscribe
 * Unsubscribe from newsletter
 */
export async function unsubscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  return {
    success: true,
    message: 'You have been unsubscribed successfully.'
  };
}

// =============================================================================
// CONTACT API
// =============================================================================

/**
 * POST /api/contact
 * Send contact message
 */
export async function sendContactMessage(message: ContactMessage): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  console.log('Contact message:', message);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: 'Your message has been sent successfully. We will respond within 24-48 hours.'
  };
}

// =============================================================================
// CART API (Uses Supabase)
// =============================================================================

/**
 * GET /api/cart
 * Fetch user's cart
 */
export async function getCart(): Promise<CartItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id);
  
  return (data || []).map(item => ({
    bookId: item.book_id,
    quantity: item.quantity,
    format: 'hardbook' as const, // Would need format column in DB
  }));
}

/**
 * POST /api/cart/add
 * Add item to cart
 */
export async function addToCart(item: CartItem): Promise<{ success: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  
  const { error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      book_id: item.bookId,
      quantity: item.quantity,
    });
  
  return { success: !error };
}

/**
 * DELETE /api/cart/:bookId
 * Remove item from cart
 */
export async function removeFromCart(bookId: string): Promise<{ success: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('book_id', bookId);
  
  return { success: !error };
}

// =============================================================================
// ORDERS API (Uses Supabase)
// =============================================================================

/**
 * GET /api/orders
 * Fetch user's orders
 */
export async function getOrders(): Promise<Order[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  return (data || []).map(order => ({
    id: order.id,
    userId: order.user_id,
    items: (order.order_items || []).map((item: any) => ({
      bookId: item.book_id,
      bookTitle: item.book_title,
      bookAuthor: item.book_author,
      bookImage: item.book_image,
      quantity: item.quantity,
      price: item.price,
      format: 'hardbook',
    })),
    total: order.total,
    status: order.status as Order['status'],
    shippingAddress: order.shipping_address as unknown as ShippingAddress,
    paymentMethod: 'card',
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }));
}

/**
 * GET /api/orders/:id
 * Fetch single order
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  
  if (!data) return null;
  
  return {
    id: data.id,
    userId: data.user_id,
    items: (data.order_items || []).map((item: any) => ({
      bookId: item.book_id,
      bookTitle: item.book_title,
      bookAuthor: item.book_author,
      bookImage: item.book_image,
      quantity: item.quantity,
      price: item.price,
      format: 'hardbook',
    })),
    total: data.total,
    status: data.status as Order['status'],
    shippingAddress: data.shipping_address as unknown as ShippingAddress,
    paymentMethod: 'card',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function createOrder(orderData: {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}): Promise<{ success: boolean; orderId?: string; message: string }> {
  // TODO: Implement with payment processing
  return {
    success: true,
    orderId: `ORD-${Date.now()}`,
    message: 'Order placed successfully!'
  };
}

// =============================================================================
// WISHLIST API (Uses Supabase)
// =============================================================================

/**
 * GET /api/wishlist
 * Fetch user's wishlist
 */
export async function getWishlist(): Promise<WishlistItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', user.id);
  
  return (data || []).map(item => ({
    bookId: item.book_id,
    bookTitle: item.book_title,
    bookAuthor: item.book_author,
    bookImage: item.book_image,
    bookPrice: item.book_price,
    addedAt: item.created_at,
  }));
}

/**
 * POST /api/wishlist/add
 * Add book to wishlist
 */
export async function addToWishlist(book: {
  id: string;
  title: string;
  author: string;
  image?: string;
  price: number;
}): Promise<{ success: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  
  const { error } = await supabase
    .from('wishlist')
    .insert({
      user_id: user.id,
      book_id: book.id,
      book_title: book.title,
      book_author: book.author,
      book_image: book.image,
      book_price: book.price,
    });
  
  return { success: !error };
}

/**
 * DELETE /api/wishlist/:bookId
 * Remove book from wishlist
 */
export async function removeFromWishlist(bookId: string): Promise<{ success: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('book_id', bookId);
  
  return { success: !error };
}

// =============================================================================
// AUTH API (Uses Supabase Auth)
// =============================================================================

/**
 * POST /api/auth/signup
 * Register new user
 */
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  
  return { user: data.user, error };
}

/**
 * POST /api/auth/signin
 * Sign in user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { user: data.user, session: data.session, error };
}

/**
 * POST /api/auth/signout
 * Sign out user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * GET /api/auth/user
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * PUT /api/auth/profile
 * Update user profile
 */
export async function updateProfile(data: { fullName?: string; avatarUrl?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };
  
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.fullName,
      avatar_url: data.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);
  
  return { error };
}
