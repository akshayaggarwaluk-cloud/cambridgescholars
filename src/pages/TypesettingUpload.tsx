import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function TypesettingUpload() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* PAGE HEADER */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide min-h-[140px] md:h-[200px] flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 py-6 md:py-0">
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] md:my-[10px]">Typesetting Upload</h1>
          <PageBreadcrumb currentPage="Typesetting Upload" />
        </div>
      </div>

      <section className="container-wide pb-16 bg-white">
        <div className="max-w-4xl mx-auto pt-12">
          <ul className="list-disc pl-6 space-y-3 text-base">
            <li>
              <a
                href="/typesetting"
                className="text-[#C75B2A] hover:underline"
              >
                Comprehensive Overview of the Publication Process
              </a>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
