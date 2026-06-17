import { useParams } from "react-router-dom";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePolicyPage } from "@/hooks/usePolicyPage";
import NotFound from "@/pages/NotFound";

const PolicyPage = () => {
  const { slug = "" } = useParams();
  const { page, loaded, hasCustom } = usePolicyPage(slug);

  if (!loaded) {
    return (
      <div className="min-h-screen flex flex-col text-black">
        <Header />
        <main className="flex-1 py-24 text-center text-[#666]">Loading…</main>
        <Footer />
      </div>
    );
  }

  if (!page) return <NotFound />;

  const title = page.title;
  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">{title}</h1>
          <PageBreadcrumb currentPage={title} />
        </div>
      </div>
      <main className="flex-1 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          {hasCustom ? (
            <div
              className="cms-rich-content text-[#333333] text-[16px] font-nav leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: page.content || "" }}
            />
          ) : (
            <p className="text-[#666] text-[16px] font-nav">This page has no content yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;