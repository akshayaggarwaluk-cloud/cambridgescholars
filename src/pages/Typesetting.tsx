import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";

// SendThisFile FileBox widget URL — extracted from the archived
// https://archive.cambridgescholars.com/typesetting/ page.
const SENDTHISFILE_URL =
  "https://www21.sendthisfile.com/filebox/index.jsp?balance=13308&widgetcode=rmdAEQK7NsksIsI4cGToas83&errorMessage=";

export default function Typesetting() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Typesetting
          </h1>
          <PageBreadcrumb currentPage="Typesetting" />
        </div>
      </div>

      <section className="container-wide pb-6 bg-white">
        <div className="pt-12">
          <p className="text-[#333333] text-base leading-relaxed mb-8">
            To send large files for typesetting, please use the application below, entering the password provided by our Editorial team. Please note, this application may take a few moments to load.
          </p>

          {iframeError ? (
            <div className="border border-dashed border-gray-300 rounded-none p-10 text-center">
              <p className="text-[#333333] mb-4">
                It looks like your browser is blocking the upload form. You can open it in a new tab instead.
              </p>
              <Button
                asChild
                variant="gold"
                className="uppercase tracking-wider"
              >
                <a
                  href={SENDTHISFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open upload form
                </a>
              </Button>
            </div>
          ) : (
            <div className="min-h-[700px] w-full">
              <iframe
                src={SENDTHISFILE_URL}
                width="100%"
                height="700"
                style={{ border: 0 }}
                title="Send files for typesetting"
                allow="clipboard-write"
                onError={() => setIframeError(true)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
