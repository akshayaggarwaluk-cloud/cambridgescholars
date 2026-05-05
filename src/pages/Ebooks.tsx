import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, BookOpen, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { listEbooks, type EbookActivation } from "@/services/accountService";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

export default function Ebooks() {
  const { isAuthenticated } = useExternalAuth();
  const [ebooks, setEbooks] = useState<EbookActivation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await listEbooks();
        if (!cancelled) setEbooks(res.ebooks || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load your ebooks.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Sign in to view your ebooks
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access your VitalSource ebook library.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            My Ebooks
          </h1>
          <PageBreadcrumb items={[{ label: "Account", href: "/profile" }]} currentPage="Ebooks" />
        </div>
      </div>

      <main className="container-wide max-w-7xl py-12 px-6 md:px-16">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded">{error}</div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">You don't have any ebook activations yet.</p>
            <Button asChild variant="outline" className="rounded-none uppercase tracking-wider">
              <Link to="/product">Browse Books</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#e3e1d8]">
            <table className="w-full text-left">
              <thead className="bg-[#f4f3ec] text-[13px] uppercase tracking-wider text-[#333333]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ISBN-13</th>
                  <th className="px-4 py-3 font-semibold">ISBN-10</th>
                  <th className="px-4 py-3 font-semibold">VitalSource ID</th>
                  <th className="px-4 py-3 font-semibold">Activated</th>
                  <th className="px-4 py-3 font-semibold text-right">Read</th>
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#333333]">
                {ebooks.map((e, idx) => {
                  const isbn13 = e.isbn13 || e.isbn || "";
                  return (
                    <tr key={`${isbn13}-${idx}`} className="border-t border-[#e3e1d8] hover:bg-[#fafaf6]">
                      <td className="px-4 py-3 font-mono text-[12px]">{isbn13 || "—"}</td>
                      <td className="px-4 py-3 font-mono text-[12px]">{e.isbn10 || "—"}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-[#666]">
                        {e.vitalsource_book_id || "—"}
                      </td>
                      <td className="px-4 py-3">{formatDate(e.activated_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href="https://bookshelf.vitalsource.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#C75B2A] hover:underline text-sm font-semibold uppercase tracking-wider"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-3">
              Ebooks are read in your VitalSource Bookshelf using the email tied to this account.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}