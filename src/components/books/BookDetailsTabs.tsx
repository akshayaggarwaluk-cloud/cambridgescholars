import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "@/contexts/CartContext";
import { Facebook, Linkedin } from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface BookDetailsTabsProps {
  book: Book;
}

export function BookDetailsTabs({ book }: BookDetailsTabsProps) {
  const hasBlurb = book.blurb || book.description;
  const hasBiography = book.biography;
  const hasBookInfo = book.hardbackInfo || book.paperbackInfo || book.ebookInfo || book.categories || book.subjectCodes;
  const hasReviews = book.apiReviews && book.apiReviews.length > 0;

  if (!hasBlurb && !hasBiography && !hasBookInfo && !hasReviews) {
    return null;
  }

  return (
    <section className="container-wide mt-[100px]">
      <Tabs defaultValue="blurb" className="w-full">
        <TabsList className="w-full justify-center border-b border-border bg-transparent h-auto p-0 gap-12 flex-wrap">
          {hasBlurb && (
            <TabsTrigger 
              value="blurb" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-base font-semibold uppercase tracking-wider"
            >
              Blurb
            </TabsTrigger>
          )}
          {hasBiography && (
            <TabsTrigger 
              value="biography" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-base font-semibold uppercase tracking-wider"
            >
              Biography
            </TabsTrigger>
          )}
          {hasBookInfo && (
            <TabsTrigger 
              value="book-info" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-base font-semibold uppercase tracking-wider"
            >
              Book Information
            </TabsTrigger>
          )}
          {hasReviews && (
            <TabsTrigger
              value="review"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-base font-semibold uppercase tracking-wider"
            >
              Reviews
            </TabsTrigger>
          )}
        </TabsList>

        {hasBlurb && (
          <TabsContent value="blurb" className="pt-8">
            <div className="max-w-none">
              <p
                className="whitespace-pre-line"
                style={{
                  color: "#696969",
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                }}
              >
                {book.blurb || book.description}
              </p>
            </div>
          </TabsContent>
        )}

        {hasBiography && (
          <TabsContent value="biography" className="pt-8">
            <div className="max-w-none">
              <p
                className="whitespace-pre-line"
                style={{
                  color: "#696969",
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                }}
              >
                {book.biography}
              </p>
            </div>
          </TabsContent>
        )}

        {hasBookInfo && (
          <TabsContent value="book-info" className="pt-8">
            <div style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
              {/* Format-specific ISBN information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {book.hardbackInfo && (
                  <div>
                    <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", sans-serif' }}>HARDBACK</h4>
                    <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                      {book.hardbackInfo.isbn && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN:</span> {book.hardbackInfo.isbn}
                        </li>
                      )}
                      {book.hardbackInfo.isbn13 && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN13:</span> {book.hardbackInfo.isbn13}
                        </li>
                      )}
                      {book.hardbackInfo.publicationDate && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>Date of Publication:</span> {book.hardbackInfo.publicationDate}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {book.paperbackInfo && (
                  <div>
                    <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", sans-serif' }}>PAPERBACK</h4>
                    <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                      {book.paperbackInfo.isbn && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN:</span> {book.paperbackInfo.isbn}
                        </li>
                      )}
                      {book.paperbackInfo.isbn13 && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN13:</span> {book.paperbackInfo.isbn13}
                        </li>
                      )}
                      {book.paperbackInfo.publicationDate && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>Date of Publication:</span> {book.paperbackInfo.publicationDate}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {book.ebookInfo && (
                  <div>
                    <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", sans-serif' }}>EBOOK</h4>
                    <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                      {book.ebookInfo.isbn && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN:</span> {book.ebookInfo.isbn}
                        </li>
                      )}
                      {book.ebookInfo.isbn13 && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN13:</span> {book.ebookInfo.isbn13}
                        </li>
                      )}
                      {book.ebookInfo.publicationDate && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>Date of Publication:</span> {book.ebookInfo.publicationDate}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Categories and Pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {book.categories && book.categories.length > 0 && (
                  <div className="text-lg" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    <span style={{ fontSize: "18px", color: "#696969", fontWeight: 600, letterSpacing: "0.02em", fontFamily: '"Nunito Sans", sans-serif' }}>CATEGORIES:</span>{" "}
                    <span style={{ fontSize: "18px", color: "#696969", fontWeight: 600, fontFamily: '"Nunito Sans", sans-serif' }}>{book.categories.join(", ")}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="text-lg" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    <span style={{ fontSize: "18px", color: "#696969", fontWeight: 600, letterSpacing: "0.02em", fontFamily: '"Nunito Sans", sans-serif' }}>PAGES:</span>{" "}
                    <span style={{ fontSize: "18px", color: "#696969", fontWeight: 600, fontFamily: '"Nunito Sans", sans-serif' }}>{book.pages}</span>
                  </div>
                )}
              </div>

              {/* Subject Codes */}
              {book.subjectCodes && (
                <div className="text-lg" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                  <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "35px 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", sans-serif' }}>SUBJECT CODES:</h4>
                  <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                    {book.subjectCodes.bic && book.subjectCodes.bic.length > 0 && (
                      <li style={{ fontSize: "18px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                        <span style={{ color: "#696969", fontWeight: 700 }}>BIC:</span> {book.subjectCodes.bic.join(", ")}
                      </li>
                    )}
                    {book.subjectCodes.bisac && book.subjectCodes.bisac.length > 0 && (
                      <li style={{ fontSize: "18px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                        <span style={{ color: "#696969", fontWeight: 700 }}>BISAC:</span> {book.subjectCodes.bisac.join(", ")}
                      </li>
                    )}
                    {book.subjectCodes.thema && book.subjectCodes.thema.length > 0 && (
                      <li style={{ fontSize: "18px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", sans-serif' }}>
                        <span style={{ color: "#696969", fontWeight: 700 }}>THEMA:</span> {book.subjectCodes.thema.join(", ")}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {hasReviews && (
          <TabsContent value="review" className="pt-8">
            <div className="space-y-8 max-w-none">
              {book.apiReviews!.map((review, idx) => (
                <div key={idx} className="text-foreground/80">
                  <p className="leading-relaxed text-base mb-2">
                    {review.review.replace(/^[“"']|[”"']$/g, "")}
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold">
                    - —{review.reviewer}
                    {review.reviewer_position && ` ${review.reviewer_position}`}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Share this book section */}
      <div className="mt-16 pt-8 border-t border-border text-center">
        <p className="text-foreground font-semibold mb-4 text-lg">Share this book:</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-6 w-6" />
          </button>
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out "${book.title}" by ${book.author}`)}`, '_blank')}
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Share on X"
          >
            <XIcon />
          </button>
          <button
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}