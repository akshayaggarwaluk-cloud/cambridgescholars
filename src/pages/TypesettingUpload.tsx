import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function TypesettingUpload() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative h-[35vh] min-h-[280px] flex items-center justify-center bg-[#f4f3ec]">
        <h1 className="relative z-10 font-serif text-[#333333] text-3xl md:text-5xl text-center">
          Typesetting Upload
        </h1>
      </section>

      <section className="container-wide py-8 bg-white">
        <PageBreadcrumb currentPage="Typesetting Upload" />
      </section>

      <section className="container-wide pb-16 bg-white">
        <div className="max-w-4xl mx-auto">
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
