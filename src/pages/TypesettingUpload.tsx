import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

// SendThisFile FileBox widget URL — same widget used on the Typesetting page.
const SENDTHISFILE_URL =
  "https://www21.sendthisfile.com/filebox/index.jsp?balance=13308&widgetcode=rmdAEQK7NsksIsI4cGToas83&errorMessage=";

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
          <p className="text-[#333333] text-base leading-relaxed mb-6">
            To send large files for typesetting, please use the application below, entering the password provided by our Editorial team. Please note, this application may take a few moments to load.
          </p>

          <p className="text-[#333333] text-base leading-relaxed mb-8">
            For a comprehensive overview of the publication process, please see our{" "}
            <a
              href="/typesetting"
              className="text-[#C75B2A] underline hover:no-underline"
            >
              Typesetting page
            </a>
            .
          </p>

          <div className="min-h-[700px] w-full">
            <iframe
              src={SENDTHISFILE_URL}
              width="100%"
              height="700"
              style={{ border: 0 }}
              title="Send files for typesetting"
              allow="clipboard-write"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
