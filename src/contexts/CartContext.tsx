import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { books } from "@/data/books";

export type BookFormat = "ebook" | "hardbook";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  description?: string;
  isbn?: string;
  pages?: number;
  publisher?: string;
  publishDate?: string;
}

export interface CartItem extends Book {
  quantity: number;
  format: BookFormat;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, format?: BookFormat) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        const cartItems: CartItem[] = data.map((item) => {
          const book = books.find((b) => b.id === item.book_id);
          if (book) {
            return { ...book, quantity: item.quantity };
          }
          return null;
        }).filter(Boolean) as CartItem[];
        
        setItems(cartItems);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncCartToDatabase = async (bookId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", bookId);
      } else {
        await supabase
          .from("cart_items")
          .upsert({
            user_id: user.id,
            book_id: bookId,
            quantity,
          }, { onConflict: "user_id,book_id" });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const addToCart = (book: Book, format: BookFormat = "hardbook") => {
    setItems((prev) => {
      // Match by both book id and format
      const existing = prev.find((item) => item.id === book.id && item.format === format);
      const newQuantity = existing ? existing.quantity + 1 : 1;
      
      // Sync to database (using book_id with format suffix for uniqueness)
      syncCartToDatabase(`${book.id}_${format}`, newQuantity);
      
      if (existing) {
        toast.success(`Added another ${format === "ebook" ? "eBook" : "Hardbook"} of "${book.title}"`);
        return prev.map((item) =>
          item.id === book.id && item.format === format
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`"${book.title}" (${format === "ebook" ? "eBook" : "Hardbook"}) added to cart`);
      return [...prev, { ...book, quantity: 1, format }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    syncCartToDatabase(cartItemId, 0);
    // cartItemId format: "bookId_format"
    const [bookId, format] = cartItemId.includes("_") 
      ? [cartItemId.substring(0, cartItemId.lastIndexOf("_")), cartItemId.substring(cartItemId.lastIndexOf("_") + 1)]
      : [cartItemId, null];
    
    setItems((prev) => prev.filter((item) => 
      format ? !(item.id === bookId && item.format === format) : item.id !== bookId
    ));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    syncCartToDatabase(cartItemId, quantity);
    // cartItemId format: "bookId_format"
    const [bookId, format] = cartItemId.includes("_") 
      ? [cartItemId.substring(0, cartItemId.lastIndexOf("_")), cartItemId.substring(cartItemId.lastIndexOf("_") + 1)]
      : [cartItemId, null];
    
    setItems((prev) =>
      prev.map((item) =>
        (format ? item.id === bookId && item.format === format : item.id === bookId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = async () => {
    if (user) {
      try {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
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
        loading,
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
