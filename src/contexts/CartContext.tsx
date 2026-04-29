import { useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useExternalAuth } from "./ExternalAuthContext";
import { showCartNotification } from "@/components/cart/CartBanner";
import { CartContext } from "./cart-context-instance";
import {
  getCart as apiGetCart,
  addCartItem as apiAddCartItem,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  applyCoupon as apiApplyCoupon,
  removeCoupon as apiRemoveCoupon,
  mergeCart as apiMergeCart,
  type CartResponse,
  type CartItem as ApiCartItem,
} from "@/services/cartService";

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

// Map upstream cart format string → local BookFormat
function toBookFormat(f?: string): BookFormat {
  if (f === "ebook") return "ebook";
  if (f === "paperback") return "paperback";
  return "hardbook"; // upstream "hardback"
}
function fromBookFormat(f: BookFormat): string {
  return f === "hardbook" ? "hardback" : f;
}

/**
 * Convert an upstream cart item to a local CartItem (Book + quantity + format).
 * We try to preserve any extra metadata (image, author) we already had locally.
 */
function mapApiItem(api: ApiCartItem, prev?: CartItem): CartItem {
  const format = toBookFormat(api.format);
  const price = api.unit_price_gbp ?? prev?.price ?? 0;
  // Cover image: prefer the upstream URL but normalise short 10-digit ISBN
  // filenames to the 978-prefixed variant the CDN actually serves. The cart
  // endpoint frequently omits cover_image entirely, so fall back to the
  // canonical CDN path derived from the ISBN.
  let image = api.cover_image || prev?.image || "";
  const shortIsbnInUrl = image.match(/\/(\d{10})\.jpg$/);
  if (shortIsbnInUrl && !image.includes("/978")) {
    image = image.replace(`/${shortIsbnInUrl[1]}.jpg`, `/978${shortIsbnInUrl[1]}.jpg`);
  }
  if (!image && api.isbn) {
    const digits = api.isbn.replace(/[^0-9]/g, "");
    const isbn13 = digits.length === 10 ? `978${digits}` : digits;
    if (isbn13.length === 13) {
      image = `https://cspcontents.s3.eu-west-1.amazonaws.com/master/croppedcovers/${isbn13}.jpg`;
    }
  }
  return {
    id: prev?.id || api.isbn,
    title: api.title || prev?.title || "",
    author: api.author || prev?.author || "",
    price,
    image,
    rating: prev?.rating ?? 0,
    category: prev?.category ?? "General",
    isbn: api.isbn,
    description: prev?.description,
    pages: prev?.pages,
    publisher: prev?.publisher,
    publishDate: prev?.publishDate,
    blurb: prev?.blurb,
    shortDescription: prev?.shortDescription,
    biography: prev?.biography,
    hardbackInfo: prev?.hardbackInfo,
    paperbackInfo: prev?.paperbackInfo,
    ebookInfo: prev?.ebookInfo,
    categories: prev?.categories,
    subjectCodes: prev?.subjectCodes,
    samplePdfUrl: prev?.samplePdfUrl,
    apiReviews: prev?.apiReviews,
    recommendedBooks: prev?.recommendedBooks,
    subtitle: prev?.subtitle,
    series: prev?.series,
    quantity: api.quantity,
    format,
  };
}

/**
 * Cart is backed by the CSP /api/website/cart endpoints.
 * - Guest carts persist via the X-Cart-Token cookie stored in localStorage.
 * - On login, the guest cart is automatically merged into the user cart.
 * - On logout, local cart state and guest cart token are cleared.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [couponEligibleIsbns, setCouponEligibleIsbns] = useState<string[]>([]);
  const [couponEligibleBindings, setCouponEligibleBindings] = useState<string[]>([]);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [serverSubtotal, setServerSubtotal] = useState<number | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [shippingRequiresQuote, setShippingRequiresQuote] = useState<boolean>(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const SHIPPING_COUNTRY_KEY = "cspShippingCountry";
  const [shippingCountry, setShippingCountryState] = useState<string>(() => {
    try { return localStorage.getItem(SHIPPING_COUNTRY_KEY) || "GB"; } catch { return "GB"; }
  });
  const setShippingCountry = useCallback((c: string) => {
    setShippingCountryState(c);
    try { localStorage.setItem(SHIPPING_COUNTRY_KEY, c); } catch { /* ignore */ }
  }, []);
  const { user, isAuthenticated } = useExternalAuth();
  const itemsRef = useRef<CartItem[]>([]);
  itemsRef.current = items;
  const lastAuthState = useRef<boolean | null>(null);

  const applyResponse = useCallback((res: CartResponse) => {
    const prevByIsbnFmt = new Map<string, CartItem>();
    itemsRef.current.forEach((it) => {
      if (it.isbn) prevByIsbnFmt.set(`${it.isbn}_${fromBookFormat(it.format)}`, it);
    });
    const next = (res.items || []).map((api) =>
      mapApiItem(api, prevByIsbnFmt.get(`${api.isbn}_${api.format ?? "hardback"}`)),
    );
    setItems(next);
    setCouponCode(res.coupon_code ?? null);
    setDiscount(res.discount_gbp ?? null);
    // Only trust explicit eligibility info from the backend. We do not infer
    // which items a coupon applies to client-side because the upstream cart
    // API currently does not return per-item or per-binding eligibility.
    setCouponEligibleIsbns(
      Array.isArray(res.coupon_eligible_isbns)
        ? res.coupon_eligible_isbns.map((s) => String(s).replace(/[^0-9Xx]/g, "").toUpperCase())
        : [],
    );
    setCouponEligibleBindings(
      Array.isArray(res.coupon_eligible_bindings)
        ? res.coupon_eligible_bindings.map((s) => String(s).toLowerCase())
        : res.coupon_binding
          ? [String(res.coupon_binding).toLowerCase()]
          : [],
    );
    setServerTotal(res.total_gbp ?? res.subtotal_gbp ?? null);
    setServerSubtotal(res.subtotal_gbp ?? null);
    setShipping(res.shipping_gbp ?? null);
    setShippingRequiresQuote(Boolean(res.shipping_requires_quote));
    setDeliveryEstimate(res.delivery_estimate ?? null);
  }, []);

  // Initial load + reload on auth state change (login → merge, logout → reset).
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        // On transition from logged-out → logged-in, merge the guest cart first.
        if (isAuthenticated && lastAuthState.current === false) {
          try {
            const merged = await apiMergeCart();
            if (!cancelled) applyResponse(merged);
          } catch {
            // Falling through to plain getCart below if merge had nothing to merge
          }
        }
        const res = await apiGetCart(shippingCountry);
        if (!cancelled) applyResponse(res);
      } catch (e) {
        console.warn("[cart] failed to load cart:", e);
      } finally {
        if (!cancelled) setLoading(false);
        lastAuthState.current = isAuthenticated;
      }
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, shippingCountry]);

  const formatLabel = (format: BookFormat) =>
    format === "ebook" ? "EBook" : format === "paperback" ? "Paperback" : "Hardback";

  // Resolve the ISBN that the backend expects. Books from the new API expose
  // `book.isbn`; fall back to `id` (which is also the ISBN for new-format books).
  const resolveIsbn = (book: Book): string | null => book.isbn || book.id || null;

  const addToCart = useCallback(async (book: Book, format: BookFormat = "hardbook") => {
    const isbn = resolveIsbn(book);
    if (!isbn) {
      toast.error("This book cannot be added to the cart (missing ISBN).");
      return;
    }
    // Optimistic add so the cart count updates instantly.
    setItems((prev) => {
      const existing = prev.find((it) => it.id === book.id && it.format === format);
      if (existing) {
        return prev.map((it) =>
          it.id === book.id && it.format === format ? { ...it, quantity: it.quantity + 1 } : it,
        );
      }
      return [...prev, { ...book, isbn, quantity: 1, format }];
    });
    try {
      const res = await apiAddCartItem({ isbn, format: fromBookFormat(format), quantity: 1 });
      applyResponse(res);
      showCartNotification(`&ldquo;${book.title}&rdquo; (${formatLabel(format)}) has been added to your cart.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add item to cart");
      // Reload from server to recover from optimistic mismatch
      try { applyResponse(await apiGetCart()); } catch { /* ignore */ }
    }
  }, [applyResponse]);

  const removeFromCart = useCallback(async (bookId: string, format: BookFormat = "hardbook") => {
    const target = itemsRef.current.find((it) => it.id === bookId && it.format === format);
    const isbn = target?.isbn || bookId;
    setItems((prev) => prev.filter((it) => !(it.id === bookId && it.format === format)));
    toast.info("Item removed from cart");
    try {
      const res = await apiRemoveCartItem(isbn);
      applyResponse(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove item");
      try { applyResponse(await apiGetCart()); } catch { /* ignore */ }
    }
  }, [applyResponse]);

  const updateQuantity = useCallback(async (bookId: string, format: BookFormat, quantity: number) => {
    const target = itemsRef.current.find((it) => it.id === bookId && it.format === format);
    const isbn = target?.isbn || bookId;
    if (quantity <= 0) {
      void removeFromCart(bookId, format);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === bookId && it.format === format ? { ...it, quantity } : it)),
    );
    try {
      const res = await apiUpdateCartItem(isbn, quantity);
      applyResponse(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update quantity");
      try { applyResponse(await apiGetCart()); } catch { /* ignore */ }
    }
  }, [applyResponse, removeFromCart]);

  const clearCart = useCallback(async () => {
    const current = itemsRef.current;
    setItems([]);
    setCouponCode(null);
    setDiscount(null);
    setServerTotal(null);
    // Best-effort: remove each item server-side
    for (const it of current) {
      const isbn = it.isbn || it.id;
      try { await apiRemoveCartItem(isbn); } catch { /* ignore */ }
    }
    try { applyResponse(await apiGetCart()); } catch { /* ignore */ }
  }, [applyResponse]);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const res = await apiApplyCoupon(code);
      applyResponse(res);
      toast.success("Coupon applied");
    } catch (e) {
      throw e;
    }
  }, [applyResponse]);

  const removeCouponHandler = useCallback(async () => {
    try {
      const res = await apiRemoveCoupon();
      applyResponse(res);
      toast.info("Coupon removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove coupon");
    }
  }, [applyResponse]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const computedSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartSubtotal = serverSubtotal ?? computedSubtotal;
  const cartTotal = serverTotal ?? cartSubtotal + (shipping ?? 0) - (discount ?? 0);

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
        cartSubtotal,
        shipping,
        shippingRequiresQuote,
        deliveryEstimate,
        shippingCountry,
        setShippingCountry,
        loading,
        couponCode,
        discount,
        couponEligibleIsbns,
        couponEligibleBindings,
        applyCoupon,
        removeCoupon: removeCouponHandler,
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
