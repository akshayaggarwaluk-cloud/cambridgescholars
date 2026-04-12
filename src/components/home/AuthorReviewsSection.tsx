import { useEffect, useState } from "react";
import { fetchAuthorReviews, fetchBooks } from "@/services/cspApi";

interface AuthorReview {
  author: string;
  book_title: string;
  praise: string;
  date: string;
  coverImage?: string;
}

export function AuthorReviewsSection() {
  const [reviews, setReviews] = useState<AuthorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchAuthorReviews()
      .then((data) => {
        // Show reviews immediately
        setReviews(data.map((r) => ({ ...r })));
        setLoading(false);

        // Fetch cover images only for first 6 (visible) reviews
        data.slice(0, 6).forEach((r, i) => {
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

  // Fetch covers for newly visible reviews when "Show More" is clicked
  useEffect(() => {
    if (reviews.length === 0) return;
    reviews.slice(0, visibleCount).forEach((r, i) => {
      if (r.coverImage) return; // already fetched
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
  }, [visibleCount]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-[#f4f3ec]">
        <div className="container-wide">
          <div className="bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-center text-foreground mb-14">Author Experiences</h2>
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-[#f4f3ec]">
        <div className="container-wide">
          <div className="bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-center text-foreground mb-14">Author Experiences</h2>
            <p className="text-center text-muted-foreground">No author experiences available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const parseAuthor = (raw: string) => {
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
    <section className="py-8 md:py-12 bg-[#f4f3ec]">
      <div className="container-wide">
        <div className="bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-center text-foreground mb-14">
          Author Experiences
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-14">
          {visible.map((review, index) => {
            const { name, title } = parseAuthor(review.author);
            return (
              <div key={index} className="flex gap-6 items-start">
                {/* Book cover */}
                <div className="flex-shrink-0 w-32 md:w-40 lg:w-44">
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
                {/* Quote and author */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-foreground text-[13px] leading-relaxed mb-5 text-justify">
                    "{review.praise}"
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-accent">{name}</span>
                    {title && (
                      <span className="text-muted-foreground"> – {title}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="text-sm font-semibold text-accent hover:text-accent/80 tracking-wider uppercase border border-accent px-6 py-2 rounded transition-colors hover:bg-accent/10"
            >
              Show More
            </button>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
