import { useEffect, useState } from "react";
import { fetchAuthorReviews, fetchBooks } from "@/services/cspApi";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Separator } from "@/components/ui/separator";

interface AuthorReview {
  author: string;
  book_title: string;
  praise: string;
  date: string;
  coverImage?: string;
}

export default function AuthorExperiences() {
  const [reviews, setReviews] = useState<AuthorReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthorReviews()
      .then((data) => {
        const mapped = data.map((r) => ({ ...r }));
        setReviews(mapped);
        setLoading(false);

        // Fetch cover images progressively
        mapped.forEach((r, i) => {
          fetchBooks({ search: r.book_title, per_page: 1 })
            .then((result) => {
              const cover = result.books[0]?.image;
              if (cover) {
                setReviews((prev) => {
                  const updated = [...prev];
                  if (updated[i]) updated[i] = { ...updated[i], coverImage: cover };
                  return updated;
                });
              }
            })
            .catch(() => {});
        });
      })
      .catch(() => {
        setReviews([]);
        setLoading(false);
      });
  }, []);

  const parseAuthor = (raw: string | null) => {
    if (!raw) return { name: "Unknown", title: "" };
    const separators = [" - ", " – ", ", "];
    for (const sep of separators) {
      const idx = raw.indexOf(sep);
      if (idx > 0) {
        return { name: raw.slice(0, idx).trim(), title: raw.slice(idx + sep.length).trim() };
      }
    }
    return { name: raw, title: "" };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-white">
        {/* Header area */}
        <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-serif text-gray-800">Author Experiences</h1>
            <PageBreadcrumb currentPage="Author Experiences" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 md:py-14 bg-white">
          <p className="font-nav font-normal text-[#333333] leading-relaxed text-[15px] mb-10">
            There is no clearer indication of the successful relationships we have built with thousands of academics over the years than their own views of the experience.
          </p>

          {loading ? (
            <p className="text-center text-muted-foreground py-10">Loading author experiences...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No author experiences available at the moment.</p>
          ) : (
            <div className="space-y-0">
              {reviews.map((review, index) => {
                const { name, title } = parseAuthor(review.author);
                return (
                  <div key={index}>
                    <Separator className="my-0" />
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 md:gap-8 py-8 md:py-10">
                      {/* Book cover */}
                      <div className="flex-shrink-0 w-40 sm:w-28 md:w-36 lg:w-40">
                        {review.coverImage ? (
                          <img
                            src={review.coverImage}
                            alt={review.book_title}
                            className="w-full h-auto shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-muted rounded flex items-center justify-center animate-pulse">
                            <span className="text-xs text-muted-foreground text-center px-2">{review.book_title}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <p className="font-nav font-normal leading-relaxed mb-5 text-[15px] text-[#333333] text-justify">
                          "{review.praise}"
                        </p>
                        <p className="font-nav font-normal text-[15px] text-[#333333]">
                          <span className="font-bold">{name}</span>
                          {title && (
                            <span> – {title}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Separator />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
