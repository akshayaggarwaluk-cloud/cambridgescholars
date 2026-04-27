import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, ChevronsRight } from "lucide-react";
import { fetchPublishedResources, type CmsResource } from "@/services/cmsService";

export default function Resources() {
  const [resources, setResources] = useState<CmsResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedResources()
      .then(setResources)
      .catch((e) => console.error("Failed to load resources:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Resources</h1>
          <PageBreadcrumb currentPage="Resources" />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="container-wide">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading resources…
            </div>
          ) : resources.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No resources available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto">
              {resources.map((item) => (
                <div key={item.id} className="group">
                  {item.cover_image && (
                    <Link to={`/resources/${item.slug}`} className="block overflow-hidden cursor-pointer">
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="w-full h-80 md:h-96 object-cover"
                      />
                    </Link>
                  )}
                  <div className="mt-6">
                    <h2 className="font-baskerville text-[21px] text-[#333333] mb-3 tracking-wider">{item.title}</h2>
                    {item.excerpt && (
                      <p className="font-nav text-[15px] text-[#7E7E7E] leading-relaxed mb-4 max-w-2xl">
                        {item.excerpt}
                      </p>
                    )}
                    <Link
                      to={`/resources/${item.slug}`}
                      className="inline-flex items-center gap-1 font-extrabold text-xs uppercase tracking-[0.15em] text-[#e4573d] hover:text-[#e4573d]/80 transition-colors"
                      style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif" }}
                    >
                      READ MORE
                      <ChevronsRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
