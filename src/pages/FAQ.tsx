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
                    className="border border-[#E5E5E5] rounded-md bg-[#F8F8F8] px-5"
                  >
                    <AccordionTrigger className="text-left font-nav font-normal text-[#333333] hover:text-accent hover:no-underline py-5 text-[17px] leading-[1.6] [&[data-state=open]>svg]:rotate-180">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-nav text-[#696969] leading-[1.6] pb-5 text-[16px] whitespace-pre-wrap">
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
