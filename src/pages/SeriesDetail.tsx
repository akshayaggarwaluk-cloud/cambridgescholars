import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { fetchSeriesDetail, type CSPSeriesDetail } from "@/services/cspApi";

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [series, setSeries] = useState<CSPSeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetchSeriesDetail(slug);
        if (!cancelled) setSeries(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load series.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            {series?.title || "Series"}
          </h1>
          <PageBreadcrumb
            items={[{ label: "Bookshop", href: "/books" }, { label: "Series", href: "/series" }]}
            currentPage={series?.title || "Series"}
          />
        </div>
      </div>

      <main className="container-wide max-w-7xl py-12 px-6 md:px-16">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded">{error}</div>
        ) : !series ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Series not found.</p>
          </div>
        ) : (
          <>
            {series.description && (
              <p className="text-[15px] text-[#555] leading-relaxed max-w-3xl mb-8">
                {series.description}
              </p>
            )}

            <h2 className="font-baskerville text-2xl text-[#333333] mb-4">
              Titles in this series ({series.books?.length || 0})
            </h2>

            {!series.books?.length ? (
              <p className="text-muted-foreground">No titles published yet.</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {series.books.map((b) => (
                  <li key={b.isbn}>
                    <Link to={`/books/${b.isbn}`} className="block group">
                      <div className="aspect-[2/3] bg-[#f4f3ec] overflow-hidden mb-3">
                        {b.cover_image && (
                          <img
                            src={b.cover_image}
                            alt={b.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <p className="text-[14px] font-semibold text-[#333333] line-clamp-2 group-hover:text-[#C75B2A]">
                        {b.title}
                      </p>
                      {b.authors?.length > 0 && (
                        <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">
                          {b.authors.map((a) => a.name).join(", ")}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}