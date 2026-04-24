import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartHoverPanelProps {
  onNavigate?: () => void;
}

export function CartHoverPanel({ onNavigate }: CartHoverPanelProps) {
  const { items, cartTotal, removeFromCart } = useCart();

  const formatLabel = (format: string) =>
    format === "ebook" ? "EBook" : format === "paperback" ? "Paperback" : "Hardback";

  return (
    <div className="w-[380px] bg-white shadow-2xl border border-border p-6">
      {items.length === 0 ? (
        <p
          className="text-sm text-[#333333] py-4 text-center"
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
        >
          No products in the cart.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-5 max-h-[360px] overflow-y-auto pr-1">
            {items.map((item) => (
              <li
                key={`${item.id}_${item.format}`}
                className="flex items-start gap-4 pb-5 border-b border-border last:border-b-0 last:pb-0"
              >
                <Link
                  to={`/books/${item.id}`}
                  onClick={onNavigate}
                  className="shrink-0"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-contain bg-white"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-20 bg-muted flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
                      No cover
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${item.id}`}
                    onClick={onNavigate}
                    className="block font-serif text-base leading-snug text-[#333333] hover:text-accent transition-colors"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {item.title} - {formatLabel(item.format)}
                  </Link>
                  <div
                    className="mt-2 text-sm text-[#a89968]"
                    style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                  >
                    £{item.price.toFixed(2)}{" "}
                    <span className="text-[#333333] ml-1">× {item.quantity}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.format)}
                  aria-label={`Remove ${item.title}`}
                  className="shrink-0 text-[#999] hover:text-[#333333] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-5 border-t border-border">
            <div
              className="flex items-center justify-between text-base"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              <span className="font-bold text-[#333333]">Subtotal:</span>
              <span className="font-bold text-[#333333]">£{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3">
            <Link
              to="/cart"
              onClick={onNavigate}
              className="text-center px-4 py-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={onNavigate}
              className="text-center px-4 py-3 bg-[#7a7a7a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#666] transition-colors"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}