import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useExternalAuth } from "./ExternalAuthContext";

export type BookFormat = "ebook" | "hardbook" | "paperback";

export interface BookFormatInfo {
  isbn?: string;
  isbn13?: string;
  publicationDate?: string;
}

export interface APIReview {
  reviewer: string;
  reviewer_position: string;
  review: string;
  date: string;
}

export interface RecommendedBook {
  isbn: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  cover_image: string;
  authors: { name: string; role: string }[];
  formats: { type: string; price_gbp: number | null }[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description?: string;
  isbn?: string;
  pages?: number;
  publisher?: string;
  publishDate?: string;
  blurb?: string;
  shortDescription?: string;
  biography?: string;
  hardbackInfo?: BookFormatInfo;
  paperbackInfo?: BookFormatInfo;
  ebookInfo?: BookFormatInfo;
  categories?: string[];
  subjectCodes?: {
    bic?: string[];
    bisac?: string[];
    thema?: string[];
  };
  samplePdfUrl?: string;
  apiReviews?: APIReview[];
  recommendedBooks?: RecommendedBook[];
  subtitle?: string;
  series?: { title: string; slug: string; volume?: string } | null;
}

export interface CartItem extends Book {
  quantity: number;
  format: BookFormat;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, format?: BookFormat) => void;
  removeFromCart: (bookId: string, format?: BookFormat) => void;
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * In-memory cart only — no Supabase, no localStorage.
 * Cart is reset on page reload and when the user logs out.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useExternalAuth();

  // Reset cart when the user logs out.
  useEffect(() => {
    if (!user) setItems([]);
  }, [user]);

  const formatLabel = (format: BookFormat) =>
    format === "ebook" ? "eBook" : format === "paperback" ? "Paperback" : "Hardback";

  const addToCart = (book: Book, format: BookFormat = "hardbook") => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === book.id && item.format === format);
      if (existing) {
        toast.success(`Added another ${formatLabel(format)} of "${book.title}"`);
        return prev.map((item) =>
          item.id === book.id && item.format === format
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      toast.success(`"${book.title}" (${formatLabel(format)}) added to cart`);
      return [...prev, { ...book, quantity: 1, format }];
    });
  };

  const removeFromCart = (bookId: string, format: BookFormat = "hardbook") => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === bookId && item.format === format)),
    );
    toast.info("Item removed from cart");
  };

  const updateQuantity = (bookId: string, format: BookFormat, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === bookId && item.format === format ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loading: false,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
