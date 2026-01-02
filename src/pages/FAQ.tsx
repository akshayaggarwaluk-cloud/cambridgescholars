import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Orders & Shipping",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery. International orders may take 10-14 business days depending on the destination.",
      },
      {
        question: "Can I track my order?",
        answer: "Yes! Once your order ships, you'll receive an email with a tracking number. You can use this to track your package on our website or the carrier's site.",
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all books in their original condition. Simply contact our support team to initiate a return. Refunds are processed within 5-7 business days after we receive the returned item.",
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free standard shipping on all orders over $35. Members of our loyalty program receive free shipping on all orders regardless of the total.",
      },
    ],
  },
  {
    title: "eBooks & Digital Content",
    faqs: [
      {
        question: "How do I access my eBooks?",
        answer: "After purchase, your eBooks are available instantly in your account under 'My Library'. You can read them online or download them to your preferred device using our app.",
      },
      {
        question: "What formats are available for eBooks?",
        answer: "Our eBooks are available in EPUB and PDF formats, compatible with most e-readers, tablets, and smartphones. Some titles also support Kindle format.",
      },
      {
        question: "Can I read eBooks offline?",
        answer: "Yes! Download your eBooks through our mobile app to read offline anytime, anywhere. Your reading progress syncs automatically when you're back online.",
      },
    ],
  },
  {
    title: "Account & Payments",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. Gift cards can also be used for purchases.",
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard SSL encryption to protect your data. We never store your full credit card information on our servers.",
      },
      {
        question: "How do I reset my password?",
        answer: "Click 'Sign In' and then 'Forgot Password'. Enter your email address and we'll send you a link to reset your password within minutes.",
      },
      {
        question: "Can I save books for later?",
        answer: "Yes! Use our Wishlist feature to save books you're interested in. Simply click the heart icon on any book to add it to your wishlist for easy access later.",
      },
    ],
  },
  {
    title: "Publishing & Authors",
    faqs: [
      {
        question: "How can I publish my book on Biblioscape?",
        answer: "We welcome independent authors! Visit our 'Publish' page to submit your manuscript. Our team reviews submissions within 2-3 weeks and will contact you with next steps.",
      },
      {
        question: "What royalties do authors receive?",
        answer: "Authors receive competitive royalty rates starting at 35% for eBooks and 25% for print books. Higher rates are available based on sales volume and exclusive agreements.",
      },
      {
        question: "Do you offer author support services?",
        answer: "Yes! We offer editing, cover design, and marketing services for authors. Contact our author support team for a personalized consultation.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container-wide py-4">
          <nav className="text-sm text-muted-foreground">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-1">/</span>
              </li>
              <li>
                <span className="text-accent font-medium">FAQs</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <section className="relative bg-gradient-charcoal py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          </div>
          <div className="container-wide relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                <HelpCircle className="h-8 w-8 text-accent" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Find answers to common questions about orders, shipping, eBooks, and more.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container-wide py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={category.title} className="animate-fade-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold">
                    {categoryIndex + 1}
                  </span>
                  {category.title}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
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
            ))}
          </div>

          {/* Contact CTA */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                Still have questions?
              </h3>
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
