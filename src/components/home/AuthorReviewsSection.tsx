import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthorReviews, fetchAutocomplete } from "@/services/cspApi";

interface AuthorReview {
  author: string;
  book_title: string;
  praise: string;
  date: string;
  coverImage?: string;
}

export function AuthorReviewsSection() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<AuthorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // Resolve a cover image for a given review by querying the autocomplete
  // endpoint with the exact book_title and picking the best title match.
  const resolveCover = (title: string): Promise<string | null> => {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
    const target = norm(title);
    return fetchAutocomplete(title)
      .then((results) => {
        if (!results || results.length === 0) return null;
        // Prefer exact title match, otherwise the first result
        const exact = results.find((r) => norm(r.title) === target);
        const startsWith = results.find((r) => norm(r.title).startsWith(target));
        const picked = exact || startsWith || results[0];
        return picked?.cover_image || null;
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchAuthorReviews()
      .then((data) => {
        // Show reviews immediately
        setReviews(data.map((r) => ({ ...r })));
        setLoading(false);

        // Fetch cover images only for first 6 (visible) reviews
        data.slice(0, 6).forEach((r, i) => {
          resolveCover(r.book_title).then((cover) => {
            if (!cover) return;
            setReviews((prev) => {
              const updated = [...prev];
              if (updated[i]) updated[i] = { ...updated[i], coverImage: cover };
              return updated;
            });
          });
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
      resolveCover(r.book_title).then((cover) => {
        if (!cover) return;
        setReviews((prev) => {
          const updated = [...prev];
          if (updated[i]) updated[i] = { ...updated[i], coverImage: cover };
          return updated;
        });
      });
    });
  }, [visibleCount]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-[#f4f3ec]">
        <div className="mx-4 sm:mx-6 lg:mx-8 bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-center text-foreground mb-14">Author Experiences</h2>
            <p className="text-center text-muted-foreground border-[#969696]">Loading...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-[#f4f3ec]">
        <div className="mx-4 sm:mx-6 lg:mx-8 bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-center text-foreground mb-14">Author Experiences</h2>
            <p className="text-center text-muted-foreground border-[#969696]">No author experiences available at the moment.</p>
        </div>
      </section>
    );
  }

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const parseAuthor = (raw?: string | null) => {
    if (!raw || typeof raw !== "string") return { name: "", title: "" };
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
      <div className="mx-4 sm:mx-6 lg:mx-8 bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        <h2 className="font-baskerville text-3xl md:text-4xl font-normal text-center text-foreground mb-14 lg:text-4xl">
          Author Experiences
        </h2>
        <div className="grid lg:grid-cols-2 gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-14">
          {visible.map((review, index) => {
            const { name, title } = parseAuthor(review.author);
            return (
              <div key={index} className="flex flex-col items-center sm:flex-row sm:items-start gap-6 cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors" onClick={() => navigate("/reviews")}>
                {/* Book cover - responsive, ~2/3 aspect */}
                <div className="flex-shrink-0 w-40 sm:w-44 md:w-52 lg:w-44 xl:w-[203px]">
                  {review.coverImage ? (
                    <img
                      src={review.coverImage}
                      alt={review.book_title}
                      className="w-full shadow-md object-cover aspect-[203/298]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-[203/298] bg-muted rounded flex items-center justify-center animate-pulse">
                      <span className="text-xs text-muted-foreground text-center px-2">{review.book_title}</span>
                    </div>
                  )}
                </div>
                {/* Quote and author */}
                <div className="flex-1 min-w-0 pt-1 text-center sm:text-left">
                  <p
                    className="text-justify mb-5"
                    style={{
                      fontFamily: "'Nunito Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      color: "#333333",
                      lineHeight: 1.6,
                    }}
                  >
                    "{review.praise}"
                  </p>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "14px",
                      color: "#333333",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{name}</span>
                    {title && (
                      <span style={{ fontWeight: 300 }}> – {title}</span>
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
    </section>
  );
}
