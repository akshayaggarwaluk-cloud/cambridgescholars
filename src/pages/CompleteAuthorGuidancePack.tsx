import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function CompleteAuthorGuidancePack() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Complete Author Guidance Pack
          </h1>
          <PageBreadcrumb currentPage="Complete Author Guidance Pack" />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <ul
            className="list-disc pl-6 space-y-3 text-[16px] text-[#333333] leading-[1.6]"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            <li>
              <a
                href="https://cambridgescholars.com/wp-content/uploads/2025/07/Author-Guidance.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C75B2A] hover:underline font-normal"
                download
              >
                Comprehensive Overview of the Publication Process
              </a>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}