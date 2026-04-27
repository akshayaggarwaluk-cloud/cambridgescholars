import { createContext } from "react";
import type { Book, BookFormat, CartItem } from "./CartContext";

export interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, format?: BookFormat) => void;
  removeFromCart: (bookId: string, format?: BookFormat) => void;
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartSubtotal: number;
  shipping: number | null;
  shippingRequiresQuote: boolean;
  shippingCountry: string;
  setShippingCountry: (country: string) => void;
  loading: boolean;
  couponCode?: string | null;
  discount?: number | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
