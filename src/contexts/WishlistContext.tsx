import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useExternalAuth } from "./ExternalAuthContext";
import { toast } from "sonner";
import { Book } from "./CartContext";
import {
  getWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  type WishlistItem as ApiWishlistItem,
} from "@/services/accountService";
import { fetchBookByIsbn } from "@/services/cspApi";

/**
 * Local enriched wishlist item shape used by the UI.
 * The CSP API only returns ISBN + price metadata, so we hydrate
 * the title/author/cover client-side via fetchBookByIsbn (cached per session).
 */
export interface WishlistItem {
  id: string;          // local key — uses ISBN for stability
  book_id: string;     // ISBN (matches the rest of the app, where book.id === isbn)
  isbn: string;
  book_title: string;
  book_author: string;
  book_image: string | null;
  book_price: number;
  created_at: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (bookId: string) => boolean;
  addToWishlist: (book: Book) => Promise<void>;
  removeFromWishlist: (bookId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// In-memory book metadata cache so we don't refetch the same ISBN repeatedly.
const bookCache = new Map<string, Book | null>();

async function hydrateItem(apiItem: ApiWishlistItem): Promise<WishlistItem | null> {
  const isbn = (apiItem.isbn || "").trim();
  if (!isbn) return null;

  let book = bookCache.get(isbn);
  if (book === undefined) {
    try {
      const fetched = await fetchBookByIsbn(isbn);
      book = fetched ?? null;
    } catch {
      book = null;
    }
    bookCache.set(isbn, book);
  }

  return {
    id: String(apiItem.id ?? isbn),
    book_id: isbn,
    isbn,
    book_title: book?.title || `Book ${isbn}`,
    book_author: book?.author || "",
    book_image: book?.image || null,
    book_price:
      typeof apiItem.original_price === "number"
        ? apiItem.original_price
        : book?.price ?? 0,
    created_at: apiItem.added_at || new Date().toISOString(),
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useExternalAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getWishlist();
      const apiItems = res?.items || [];
      const hydrated = await Promise.all(apiItems.map(hydrateItem));
      setWishlistItems(hydrated.filter((x): x is WishlistItem => x !== null));
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user, loadWishlist]);

  const isInWishlist = (bookId: string) => {
    return wishlistItems.some(
      (item) => item.book_id === bookId || item.isbn === bookId,
    );
  };

  const addToWishlist = async (book: Book) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    const isbn = (book.isbn || book.id || "").trim();
    if (!isbn) {
      toast.error("This book cannot be added to the wishlist (missing ISBN).");
      return;
    }

    // Prime the cache so hydration on next load is instant.
    bookCache.set(isbn, book as unknown as Book);

    // Optimistic insert
    const optimistic: WishlistItem = {
      id: isbn,
      book_id: isbn,
      isbn,
      book_title: book.title,
      book_author: book.author,
      book_image: book.image || null,
      book_price: book.price,
      created_at: new Date().toISOString(),
    };
    setWishlistItems((prev) =>
      prev.some((p) => p.isbn === isbn) ? prev : [optimistic, ...prev],
    );

    try {
      const res = await addToWishlistApi(isbn);
      if (res?.message?.toLowerCase().includes("already")) {
        toast.info("Book is already in your wishlist");
      } else {
        toast.success("Added to wishlist!");
      }
      // Refresh from server to get the canonical item id.
      loadWishlist();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add to wishlist",
      );
      // Roll back optimistic insert
      setWishlistItems((prev) => prev.filter((p) => p.isbn !== isbn));
    }
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!isAuthenticated) return;

    // Resolve the ISBN — bookId from callers is typically the ISBN already.
    const target = wishlistItems.find(
      (item) => item.book_id === bookId || item.isbn === bookId,
    );
    const isbn = target?.isbn || bookId;

    // Optimistic remove
    const previous = wishlistItems;
    setWishlistItems((prev) => prev.filter((item) => item.isbn !== isbn));

    try {
      await removeFromWishlistApi(isbn);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove from wishlist",
      );
      // Roll back
      setWishlistItems(previous);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
