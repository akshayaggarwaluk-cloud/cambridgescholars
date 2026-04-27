import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Library } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { fetchSeriesList, type CSPSeriesSummary } from "@/services/cspApi";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function SeriesList() {
  const [series, setSeries] = useState<CSPSeriesSummary[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetchSeriesList(letter ? { letter, per_page: 100 } : { per_page: 200 });
        if (cancelled) return;
        setSeries(res.series);
        if (res.alphabet_counts) setCounts(res.alphabet_counts);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load series.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [letter]);

  const grouped = useMemo(() => {
    const map = new Map<string, CSPSeriesSummary[]>();
    series.forEach((s) => {
      const ch = (s.title?.[0] || "#").toUpperCase();
      const key = /[A-Z]/.test(ch) ? ch : "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [series]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Book Series
          </h1>
          <PageBreadcrumb items={[{ label: "Bookshop", href: "/books" }]} currentPage="Series" />
        </div>
      </div>

      <main className="container-wide max-w-7xl py-12 px-6 md:px-16">
        {/* Alphabet filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setLetter(null)}
            className={`px-3 py-1.5 text-sm uppercase tracking-wider border ${
              letter === null
                ? "border-[#C75B2A] bg-[#C75B2A] text-white"
                : "border-[#d8d6cd] text-[#333] hover:border-[#C75B2A]"
            }`}
          >
            All
          </button>
          {ALPHABET.map((l) => {
            const c = counts[l] ?? counts[l.toLowerCase()] ?? 0;
            const active = letter === l;
            return (
              <button
                key={l}
                onClick={() => setLetter(l)}
                disabled={c === 0 && Object.keys(counts).length > 0}
                className={`px-3 py-1.5 text-sm font-semibold border ${
                  active
                    ? "border-[#C75B2A] bg-[#C75B2A] text-white"
                    : "border-[#d8d6cd] text-[#333] hover:border-[#C75B2A] disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              >
                {l}
                {c > 0 && <span className="ml-1 text-xs opacity-70">({c})</span>}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded">{error}</div>
        ) : series.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Library className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No series found.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(([letterKey, items]) => (
              <section key={letterKey}>
                <h2 className="font-baskerville text-2xl text-[#333333] border-b border-[#e3e1d8] pb-2 mb-4">
                  {letterKey}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={`/series/${s.slug || s.id}`}
                        className="block p-4 border border-[#e3e1d8] hover:border-[#C75B2A] transition-colors"
                      >
                        <p className="font-semibold text-[#333333]">{s.title}</p>
                        {typeof s.book_count === "number" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {s.book_count} {s.book_count === 1 ? "title" : "titles"}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}