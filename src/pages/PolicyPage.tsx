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
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28 pb-6">
        <div className="container-wide min-h-[160px] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h1 className="text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[6px] flex-1 break-words">{title}</h1>
          <div className="sm:max-w-[40%] sm:text-right sm:pt-3">
            <PageBreadcrumb currentPage={title} />
          </div>
        </div>
      </div>
      <main className="flex-1 py-8 bg-white">
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