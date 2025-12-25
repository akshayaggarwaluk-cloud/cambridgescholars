import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { Book } from "./CartContext";

interface WishlistItem {
  id: string;
  book_id: string;
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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (bookId: string) => {
    return wishlistItems.some((item) => item.book_id === bookId);
  };

  const addToWishlist = async (book: Book) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    try {
      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        book_image: book.image,
        book_price: book.price,
      });

      if (error) {
        if (error.code === "23505") {
          toast.info("Book is already in your wishlist");
          return;
        }
        throw error;
      }

      toast.success("Added to wishlist!");
      loadWishlist();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      if (error) throw error;

      setWishlistItems((prev) => prev.filter((item) => item.book_id !== bookId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
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