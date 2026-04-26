import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fetchPublishedFaqs, type CmsFaq } from "@/services/cmsService";

export default function FAQ() {
  const [faqs, setFaqs] = useState<CmsFaq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedFaqs()
      .then(setFaqs)
      .catch((e) => console.error("Failed to load FAQs:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">FAQS</h1>
          <PageBreadcrumb currentPage="FAQs" />
        </div>
      </div>

      <main className="pb-16 bg-white">
        <section className="container-wide py-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading…</p>
            ) : faqs.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No FAQs available at the moment.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={`faq-${faq.id}`}
                    className="border-0"
                  >
                    <AccordionTrigger
                      className="text-left font-normal py-3 px-[30px] text-[17px] leading-[1.6] [&>svg]:hidden hover:no-underline bg-[#F8F8F8] text-[#333333] data-[state=open]:bg-[#E4573D] data-[state=open]:text-white transition-colors"
                      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#696969] leading-[1.6] pt-5 pb-5 px-5 text-[16px] whitespace-pre-wrap bg-transparent" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Final line after FAQs */}
          <div className="max-w-7xl mx-auto mt-12 text-center">
            <p className="text-lg md:text-lg text-justify text-black">
              If your question is not addressed here, please do not hesitate to contact us at{" "}
              <a href="mailto:admin@cambridgescholars.com" className="text-red-500 hover:underline">
                admin@cambridgescholars.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
