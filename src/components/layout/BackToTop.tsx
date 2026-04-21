import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center bg-white border border-[#e5e5e5] shadow-md hover:bg-[#f4f3ec] text-[#C75B2A] transition-colors"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}