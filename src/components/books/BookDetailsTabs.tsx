import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "@/contexts/CartContext";
import { Facebook, Instagram } from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TumblrIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
    <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469.014-.124.117-.179.175-.179h3.504v6.146h4.812v3.601h-4.83v7.45c.012 1.012.376 2.396 2.224 2.355.609-.013 1.422-.191 1.84-.391l1.156 3.428C18.281 22.948 16.711 24 14.563 24z" />
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
  const unifiedFontStyle = { fontFamily: '"Libre Baskerville", Georgia, serif' };

  if (!hasBlurb && !hasBiography && !hasBookInfo && !hasReviews) {
    return null;
  }

  return (
    <section className="container-wide mt-[100px]">
      <Tabs defaultValue="blurb" className="w-full">
        <TabsList className="w-full justify-start sm:justify-center bg-transparent h-auto p-0 gap-4 sm:gap-10 lg:gap-20 flex-nowrap sm:flex-wrap overflow-x-auto">
          {hasBlurb && (
            <TabsTrigger 
              value="blurb" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-lg uppercase tracking-wider text-black font-sans font-normal"
            >
              Blurb
            </TabsTrigger>
          )}
          {hasBiography && (
            <TabsTrigger 
              value="biography" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-lg uppercase tracking-wider text-black font-sans font-normal"
            >
              Biography
            </TabsTrigger>
          )}
          {hasBookInfo && (
            <TabsTrigger 
              value="book-info" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-lg uppercase tracking-wider text-black font-sans font-normal"
            >
              Book Information
            </TabsTrigger>
          )}
          {hasReviews && (
            <TabsTrigger
              value="review"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-lg uppercase tracking-wider text-black font-sans font-normal"
            >
              Review
            </TabsTrigger>
          )}
        </TabsList>

        {hasBlurb && (
          <TabsContent value="blurb" className="pt-8">
            <div className="max-w-none">
              <p className="whitespace-pre-line text-[#696969] text-base font-normal" style={{ lineHeight: 1.8, margin: "0 0 20px", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                {book.blurb || book.description}
              </p>
            </div>
          </TabsContent>
        )}

        {hasBiography && (
          <TabsContent value="biography" className="pt-8">
            <div className="max-w-none">
              <p className="whitespace-pre-line text-[#696969] text-base font-normal" style={{ lineHeight: 1.8, margin: "0 0 20px", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                {book.biography}
              </p>
            </div>
          </TabsContent>
        )}

        {hasBookInfo && (
          <TabsContent value="book-info" className="pt-8">
            <div style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
              {/* Format-specific ISBN information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {book.hardbackInfo && (
                  <div>
                    <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>HARDBACK</h4>
                    <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                      {book.hardbackInfo.isbn && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN:</span> <span style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.hardbackInfo.isbn}</span>
                        </li>
                      )}
                      {book.hardbackInfo.isbn13 && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN13:</span> <span style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.hardbackInfo.isbn13}</span>
                        </li>
                      )}
                      {book.hardbackInfo.publicationDate && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>Date of Publication:</span> {book.hardbackInfo.publicationDate}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {book.paperbackInfo && (
                  <div>
                    <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>PAPERBACK</h4>
                    <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                      {book.paperbackInfo.isbn && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN:</span> <span style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.paperbackInfo.isbn}</span>
                        </li>
                      )}
                      {book.paperbackInfo.isbn13 && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN13:</span> <span style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.paperbackInfo.isbn13}</span>
                        </li>
                      )}
                      {book.paperbackInfo.publicationDate && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>Date of Publication:</span> {book.paperbackInfo.publicationDate}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {book.ebookInfo && (
                  <div>
                    <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>EBOOK</h4>
                    <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                      {book.ebookInfo.isbn && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN:</span> <span style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.ebookInfo.isbn}</span>
                        </li>
                      )}
                      {book.ebookInfo.isbn13 && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                          <span style={{ color: "#696969", fontWeight: 700 }}>ISBN13:</span> <span style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.ebookInfo.isbn13}</span>
                        </li>
                      )}
                      {book.ebookInfo.publicationDate && (
                        <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
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
                  <div className="text-lg" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                    <span style={{ fontSize: "18px", color: "#000000", fontWeight: 600, letterSpacing: "0.02em", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>CATEGORIES:</span>{" "}
                    <span style={{ fontSize: "18px", color: "#696969", fontWeight: 600, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.categories.join(", ")}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="text-lg" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                    <span style={{ fontSize: "18px", color: "#000000", fontWeight: 600, letterSpacing: "0.02em", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>PAGES:</span>{" "}
                    <span style={{ fontSize: "18px", color: "#696969", fontWeight: 600, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>{book.pages}</span>
                  </div>
                )}
              </div>

              {/* Subject Codes */}
              {book.subjectCodes && (
                <div className="text-lg" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                  <h4 style={{ fontSize: "18px", color: "#333333", fontWeight: 600, margin: "35px 0 14px", letterSpacing: "0.02em", fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>SUBJECT CODES:</h4>
                  <ul className="list-disc" style={{ paddingLeft: "20px", margin: 0 }}>
                    {book.subjectCodes.bic && book.subjectCodes.bic.length > 0 && (
                      <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                        <span style={{ color: "#696969", fontWeight: 700 }}>BIC:</span> {book.subjectCodes.bic.join(", ")}
                      </li>
                    )}
                    {book.subjectCodes.bisac && book.subjectCodes.bisac.length > 0 && (
                      <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                        <span style={{ color: "#696969", fontWeight: 700 }}>BISAC:</span> {book.subjectCodes.bisac.join(", ")}
                      </li>
                    )}
                    {book.subjectCodes.thema && book.subjectCodes.thema.length > 0 && (
                      <li style={{ fontSize: "16px", color: "#696969", marginBottom: "8px", lineHeight: 1.6, fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
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
            <div className="space-y-8 max-w-none" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
              {book.apiReviews!.map((review, idx) => (
                <div key={idx} className="text-foreground/80">
                  <p className="leading-relaxed text-base mb-2" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                    {review.review.replace(/^[“"']|[”"']$/g, "")}
                  </p>
                  <p style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif', fontSize: "16px", color: "#696969", fontWeight: 700 }}>
                    - {review.reviewer}
                    {review.reviewer_position && `, ${review.reviewer_position}`}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Share this book section */}
      <div className="mt-16 pb-8 border-b border-border text-center">
        <p className="text-foreground font-semibold mb-4 text-lg" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>Share this book:</p>
        <div className="flex justify-center gap-5">
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
            onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Share on Instagram"
          >
            <Instagram className="h-6 w-6" />
          </button>
          <button
            onClick={() => window.open(`https://www.tumblr.com/share/link?url=${encodeURIComponent(window.location.href)}&name=${encodeURIComponent(book.title)}`, '_blank')}
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Share on Tumblr"
          >
            <TumblrIcon />
          </button>
        </div>
      </div>
    </section>
  );
}