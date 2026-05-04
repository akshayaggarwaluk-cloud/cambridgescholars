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

const GUEST_WISHLIST_KEY = "guestWishlist";

function readGuestWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

function writeGuestWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function clearGuestWishlist() {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    /* ignore */
  }
}

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
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() =>
    readGuestWishlist(),
  );
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      // Snapshot any guest items prior to fetching, so we can recover items
      // dropped by the server-side merge.
      const guestSnapshot = readGuestWishlist();

      // Push guest items to the server first (best-effort).
      if (guestSnapshot.length > 0) {
        for (const it of guestSnapshot) {
          try {
            await addToWishlistApi(it.isbn);
          } catch {
            /* ignore individual failures (e.g. already in wishlist) */
          }
        }
      }

      const res = await getWishlist();
      const apiItems = res?.items || [];
      const hydrated = await Promise.all(apiItems.map(hydrateItem));
      let merged = hydrated.filter((x): x is WishlistItem => x !== null);

      // Recovery: if anything from the snapshot is still missing, retry.
      if (guestSnapshot.length > 0) {
        const present = new Set(merged.map((it) => it.isbn));
        const missing = guestSnapshot.filter((it) => !present.has(it.isbn));
        if (missing.length > 0) {
          for (const it of missing) {
            try {
              await addToWishlistApi(it.isbn);
            } catch {
              /* ignore */
            }
          }
          try {
            const refreshed = await getWishlist();
            const reHydrated = await Promise.all(
              (refreshed?.items || []).map(hydrateItem),
            );
            merged = reHydrated.filter((x): x is WishlistItem => x !== null);
          } catch {
            /* ignore */
          }
        }
        // Clear guest snapshot once merge is attempted.
        clearGuestWishlist();
      }

      setWishlistItems(merged);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else if (!isAuthenticated) {
      // Restore guest wishlist from localStorage on logout / initial load.
      setWishlistItems(readGuestWishlist());
    }
  }, [isAuthenticated, user, loadWishlist]);

  const isInWishlist = (bookId: string) => {
    return wishlistItems.some(
      (item) => item.book_id === bookId || item.isbn === bookId,
    );
  };

  const addToWishlist = async (book: Book) => {
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
    setWishlistItems((prev) => {
      const next = prev.some((p) => p.isbn === isbn) ? prev : [optimistic, ...prev];
      if (!isAuthenticated) writeGuestWishlist(next);
      return next;
    });

    if (!isAuthenticated) {
      toast.success("Added to wishlist!");
      return;
    }

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
    // Resolve the ISBN — bookId from callers is typically the ISBN already.
    const target = wishlistItems.find(
      (item) => item.book_id === bookId || item.isbn === bookId,
    );
    const isbn = target?.isbn || bookId;

    // Optimistic remove
    const previous = wishlistItems;
    setWishlistItems((prev) => {
      const next = prev.filter((item) => item.isbn !== isbn);
      if (!isAuthenticated) writeGuestWishlist(next);
      return next;
    });

    if (!isAuthenticated) {
      toast.success("Removed from wishlist");
      return;
    }

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
