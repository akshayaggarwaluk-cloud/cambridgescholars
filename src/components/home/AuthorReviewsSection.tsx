import { useEffect, useState } from "react";
import { fetchAuthorReviews } from "@/services/cspApi";

interface AuthorReview {
  author: string;
  book_title: string;
  praise: string;
  date: string;
}

export function AuthorReviewsSection() {
  const [reviews, setReviews] = useState<AuthorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetchAuthorReviews()
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-center text-foreground mb-14">
            Author Experiences
          </h2>
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-center text-foreground mb-14">
            Author Experiences
          </h2>
          <p className="text-center text-muted-foreground">No author experiences available at the moment.</p>
        </div>
      </section>
    );
  }

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const parseAuthor = (raw: string) => {
    const separators = [", ", " - ", " – "];
    for (const sep of separators) {
      const idx = raw.indexOf(sep);
      if (idx > 0) {
        return { name: raw.slice(0, idx), title: raw.slice(idx + sep.length) };
      }
    }
    return { name: raw, title: "" };
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-10 md:py-14">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-center text-foreground mb-14">
          Author Experiences
        </h2>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {visible.map((review, index) => {
            const { name, title } = parseAuthor(review.author);
            return (
              <div key={index} className="flex flex-col gap-3">
                <p className="text-foreground text-sm leading-relaxed text-justify">
                  "{review.praise}"
                </p>
                <p className="text-sm">
                  <span className="font-bold text-accent">{name}</span>
                  {title && <span className="text-muted-foreground"> – {title}</span>}
                </p>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((c) => c + 4)}
              className="text-sm font-semibold text-accent hover:text-accent/80 tracking-wider uppercase"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
