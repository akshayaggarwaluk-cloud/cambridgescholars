import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { fetchPublishedResourceBySlug, type CmsResource } from "@/services/cmsService";

export default function ResourceDetail() {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "");
  const pathSlugMap: Record<string, string> = {
    "/post-publication": "post-publication",
    "/proposal-stage": "proposal-and-publishing-forms",
  };
  const slug = params.slug || pathSlugMap[normalizedPath];
  const [resource, setResource] = useState<CmsResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPublishedResourceBySlug(slug)
      .then(setResource)
      .catch((e) => console.error("Failed to load resource:", e))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            {resource?.title || (loading ? "" : "Resource")}
          </h1>
          <PageBreadcrumb
            items={[{ label: "Resources", href: "/resources" }]}
            currentPage={resource?.title || "Resource"}
          />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading…
            </div>
          ) : !resource ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="mb-4">This resource could not be found.</p>
              <Link to="/resources" className="text-[#E4573D] hover:underline">
                ← Back to Resources
              </Link>
            </div>
          ) : (
            <>
              {resource.content && (
                <div
                  className="text-[16px] font-normal text-[#696969] leading-[1.6] max-w-none [&_strong]:font-normal [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mt-8 [&_ul]:mb-3 [&_li]:my-0 [&_li]:leading-[1.6] [&_li::marker]:text-[#696969] [&_p]:my-2"
                  style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: renderContent(resource.content) }}
                />
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Lightweight markdown-ish renderer: supports **bold**, [text](url) links, and bullet lines
function renderContent(src: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  const inline = (s: string) =>
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (_m, text: string, url: string) => {
          const isDownload = /\.(docx?|pdf|xlsx?|pptx?|zip|csv)(\?|$)/i.test(url);
          const dl = isDownload ? ' download' : '';
          return `<a href="${url}" class="text-[#E4573D] hover:underline font-normal" target="_blank" rel="noopener noreferrer"${dl}>${text}</a>`;
        },
      );
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      if (line === "") continue;
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}