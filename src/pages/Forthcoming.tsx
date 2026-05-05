import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { fetchForthcomingBooks, type CSPForthcomingBook } from "@/services/cspApi";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export default function Forthcoming() {
  const [books, setBooks] = useState<CSPForthcomingBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchForthcomingBooks({ per_page: 60 });
        if (!cancelled) setBooks(res.books);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load forthcoming titles.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Forthcoming Titles
          </h1>
          <PageBreadcrumb items={[{ label: "Bookshop", href: "/product" }]} currentPage="Forthcoming" />
        </div>
      </div>

      <main className="container-wide max-w-7xl py-12 px-6 md:px-16">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded">{error}</div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No forthcoming titles at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#e3e1d8]">
            <table className="w-full text-left">
              <thead className="bg-[#f4f3ec] text-[13px] uppercase tracking-wider text-[#333333]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">ISBN</th>
                  <th className="px-4 py-3 font-semibold">Binding</th>
                  <th className="px-4 py-3 font-semibold">Pub. Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#333333]">
                {books.map((b) => (
                  <tr key={b.isbn} className="border-t border-[#e3e1d8] hover:bg-[#fafaf6]">
                    <td className="px-4 py-3">{b.title}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#666]">{b.isbn}</td>
                    <td className="px-4 py-3 capitalize">{b.binding}</td>
                    <td className="px-4 py-3">{formatDate(b.pub_date)}</td>
                    <td className="px-4 py-3 text-right">£{b.price_uk_gbp?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="outline" className="rounded-none uppercase tracking-wider text-xs">
                        <Link to={`/product/${b.isbn}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}