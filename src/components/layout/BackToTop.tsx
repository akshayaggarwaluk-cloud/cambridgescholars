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
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 w-10 h-10 flex items-center justify-center z-50 rounded bg-[#666666] text-white shadow-md animate-slide-in-right transition-colors duration-200 hover:bg-[#e4573d]"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}