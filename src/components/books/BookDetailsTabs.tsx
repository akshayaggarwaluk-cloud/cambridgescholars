import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "@/contexts/CartContext";
import { Facebook, Twitter, Linkedin } from "lucide-react";

interface BookDetailsTabsProps {
  book: Book;
}

export function BookDetailsTabs({ book }: BookDetailsTabsProps) {
  const hasBlurb = book.blurb || book.description;
  const hasBiography = book.biography;
  const hasBookInfo = book.hardbackInfo || book.paperbackInfo || book.ebookInfo || book.categories || book.subjectCodes;

  if (!hasBlurb && !hasBiography && !hasBookInfo) {
    return null;
  }

  return (
    <section className="container-wide mt-[100px]">
      <Tabs defaultValue="blurb" className="w-full">
        <TabsList className="w-full justify-center border-b border-border bg-transparent h-auto p-0 gap-8">
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
          <TabsTrigger 
            value="review" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 text-base font-semibold uppercase tracking-wider"
          >
            Review
          </TabsTrigger>
        </TabsList>

        {hasBlurb && (
          <TabsContent value="blurb" className="pt-8">
            <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
              <p className="text-base">{book.blurb || book.description}</p>
            </div>
          </TabsContent>
        )}

        {hasBiography && (
          <TabsContent value="biography" className="pt-8">
            <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
              <p className="text-base">{book.biography}</p>
            </div>
          </TabsContent>
        )}

        {hasBookInfo && (
          <TabsContent value="book-info" className="pt-8">
            <div className="space-y-8 text-base">
              {/* Format-specific ISBN information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {book.hardbackInfo && (
                  <div>
                    <h3 className="font-semibold text-foreground uppercase tracking-wider mb-4">Hardback</h3>
                    <ul className="space-y-2 text-foreground/80 list-disc list-inside">
                      {book.hardbackInfo.isbn && (
                        <li><span className="font-bold">ISBN:</span> {book.hardbackInfo.isbn}</li>
                      )}
                      {book.hardbackInfo.isbn13 && (
                        <li><span className="font-bold">ISBN13:</span> {book.hardbackInfo.isbn13}</li>
                      )}
                      {book.hardbackInfo.publicationDate && (
                        <li><span className="font-bold">Date of Publication:</span> {book.hardbackInfo.publicationDate}</li>
                      )}
                    </ul>
                  </div>
                )}

                {book.paperbackInfo && (
                  <div>
                    <h3 className="font-semibold text-foreground uppercase tracking-wider mb-4">Paperback</h3>
                    <ul className="space-y-2 text-foreground/80 list-disc list-inside">
                      {book.paperbackInfo.isbn && (
                        <li><span className="font-bold">ISBN:</span> {book.paperbackInfo.isbn}</li>
                      )}
                      {book.paperbackInfo.isbn13 && (
                        <li><span className="font-bold">ISBN13:</span> {book.paperbackInfo.isbn13}</li>
                      )}
                      {book.paperbackInfo.publicationDate && (
                        <li><span className="font-bold">Date of Publication:</span> {book.paperbackInfo.publicationDate}</li>
                      )}
                    </ul>
                  </div>
                )}

                {book.ebookInfo && (
                  <div>
                    <h3 className="font-semibold text-foreground uppercase tracking-wider mb-4">eBook</h3>
                    <ul className="space-y-2 text-foreground/80 list-disc list-inside">
                      {book.ebookInfo.isbn && (
                        <li><span className="font-bold">ISBN:</span> {book.ebookInfo.isbn}</li>
                      )}
                      {book.ebookInfo.isbn13 && (
                        <li><span className="font-bold">ISBN13:</span> {book.ebookInfo.isbn13}</li>
                      )}
                      {book.ebookInfo.publicationDate && (
                        <li><span className="font-bold">Date of Publication:</span> {book.ebookInfo.publicationDate}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Categories and Pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border">
                {book.categories && book.categories.length > 0 && (
                  <div>
                    <span className="font-semibold text-foreground uppercase tracking-wider">Categories:</span>{" "}
                    <span className="text-foreground/80">{book.categories.join(", ")}</span>
                  </div>
                )}
                {book.pages && (
                  <div>
                    <span className="font-semibold text-foreground uppercase tracking-wider">Pages:</span>{" "}
                    <span className="text-foreground/80">{book.pages}</span>
                  </div>
                )}
              </div>

              {/* Subject Codes */}
              {book.subjectCodes && (
                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground uppercase tracking-wider mb-4">Subject Codes:</h3>
                  <ul className="space-y-2 text-foreground/80 list-disc list-inside">
                    {book.subjectCodes.bic && book.subjectCodes.bic.length > 0 && (
                      <li><span className="font-bold">BIC:</span> {book.subjectCodes.bic.join(", ")}</li>
                    )}
                    {book.subjectCodes.bisac && book.subjectCodes.bisac.length > 0 && (
                      <li><span className="font-bold">BISAC:</span> {book.subjectCodes.bisac.join(", ")}</li>
                    )}
                    {book.subjectCodes.thema && book.subjectCodes.thema.length > 0 && (
                      <li><span className="font-bold">THEMA:</span> {book.subjectCodes.thema.join(", ")}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="review" className="pt-8">
          <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed text-center py-8">
            <p className="text-muted-foreground">No reviews yet.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share this book section */}
      <div className="mt-16 pt-8 border-t border-border text-center">
        <p className="text-foreground font-medium mb-4">Share this book:</p>
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
            aria-label="Share on Twitter"
          >
            <Twitter className="h-6 w-6" />
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