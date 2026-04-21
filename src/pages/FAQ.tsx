import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const faqs = [
  {
    question: "Do authors incur any charges when publishing with Cambridge Scholars?",
    answer:
      "There are no publishing fees for authors, either explicit or hidden. We do not charge for the review, editing, or publication of accepted manuscripts. All commercial risk associated with an author’s title is borne entirely by ourselves.",
  },
  {
    question: "What kinds of books are considered for publication?",
    answer:
      "We publish academic monographs, edited collections, and works developed from doctoral research. We do not publish journals at this time.",
  },
  {
    question: "Can I submit a book proposal if my manuscript isn’t finished?",
    answer: "Yes, we accept proposals for works in progress as well as completed manuscripts.",
  },
  {
    question: "How long does the publishing process take?",
    answer: "The complete publishing process typically takes around 4 to 6 months.",
  },
  {
    question: "Will I receive royalties?",
    answer: "Yes, royalties are provided from the first sale, with increasing rates at sales milestones.",
  },
  {
    question: "Where are your books sold?",
    answer: "Our books are available globally across libraries, distributors, and online platforms.",
  },
  {
    question: "I ordered a book. How long will delivery take?",
    answer: "Orders are dispatched within two weeks. Delivery time depends on location.",
  },
  {
    question: "Do you accept proposals from first-time authors?",
    answer: "Absolutely — first-time authors and early career researchers are welcome.",
  },
  {
    question: "Do I keep copyright of my work?",
    answer: "Yes. You retain copyright while granting us rights to publish and distribute.",
  },
  {
    question: "I submitted a proposal. When will I hear back?",
    answer: "We typically respond within 4–6 weeks. If delayed, feel free to follow up.",
  },
];
export default function FAQ() {
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
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="text-left font-normal text-[#333333] hover:text-accent hover:no-underline py-6 text-[20px] [&[data-state=open]>svg]:rotate-180">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#696969] leading-relaxed pb-6 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
