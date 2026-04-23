import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { fetchPublishedResourceBySlug, type CmsResource } from "@/services/cmsService";

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
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
    <div className="min-h-screen bg-background">
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
              {resource.excerpt && (
                <p className="font-nav text-[16px] font-normal text-[#333333] leading-[1.7] mb-10">
                  {resource.excerpt}
                </p>
              )}
              {resource.content && (
                <div
                  className="font-nav text-[16px] font-normal text-[#333333] leading-[1.7] max-w-none whitespace-pre-wrap [&_strong]:font-normal [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2 [&_li::marker]:text-[#333333] [&_p]:mb-2"
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
        '<a href="$2" class="text-[#E4573D] hover:underline font-normal" target="_blank" rel="noopener noreferrer">$1</a>',
      );
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      if (!inList) { out.push('<ul class="my-4">'); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      if (line === "") out.push("<br/>");
      else out.push(`<p class="mb-2">${inline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}