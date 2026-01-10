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

      {/* Top Banner (Breadcrumb only) */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-end">
          <h1 className="text-3xl font-serif text-gray-800">FAQs</h1>

          <PageBreadcrumb currentPage="FAQs" />
        </div>
      </div>

      <main className=" pb-16">
        <section className="container-wide py-16">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:shadow-card transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-accent py-5 [&[data-state=open]>svg]:rotate-180">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Still have questions?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent text-accent-foreground font-semibold shadow-gold hover:shadow-lg transition-all duration-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
