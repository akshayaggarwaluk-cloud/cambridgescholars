import { useState, useEffect } from "react";
import { fetchAuthorReviews } from "@/services/cspApi";

interface AuthorReview {
  author: string;
  bookTitle: string;
  praise: string;
  coverImage: string;
}

// Build a cover image URL from book title by searching the books API
async function fetchCoverForBook(bookTitle: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.cambridgescholars.com/api/website/books?search=${encodeURIComponent(bookTitle)}&per_page=1`
    );
    if (!res.ok) return "";
    const json = await res.json();
    const books = json.data || json.books || [];
    if (books.length > 0 && books[0].cover_image) {
      return books[0].cover_image;
    }
  } catch {
    // ignore
  }
  return "";
}

export function AuthorReviewsSection() {
  const [reviews, setReviews] = useState<AuthorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetchAuthorReviews()
      .then(async (data) => {
        // Filter out reviews with very short praise or that look like raw emails
        const filtered = data
          .filter((item) => item.praise && item.praise.length > 50)
          .slice(0, 20); // Cap at 20 for performance

        // Fetch cover images in parallel (first batch)
        const mapped = await Promise.all(
          filtered.map(async (item) => {
            const coverImage = await fetchCoverForBook(item.book_title);
            return {
              author: item.author,
              bookTitle: item.book_title,
              praise: item.praise.replace(/\n+/g, " ").trim(),
              coverImage,
            };
          })
        );

        setReviews(mapped);
      })
      .catch((err) => console.error("Failed to fetch author reviews:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-[#004C3A]">
        <div className="container-wide py-10 md:py-14 px-6 sm:px-10 lg:px-16 min-h-[300px] flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl mx-auto">
            <div className="h-8 bg-white/20 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-[#004C3A]">
        <div className="container-wide py-10 md:py-14 px-6 sm:px-10 lg:px-16">
          <p className="text-center text-white/70">No author experiences available at the moment.</p>
        </div>
      </section>
    );
  }

  const displayedReviews = reviews.slice(0, visibleCount);

  // Split author string: first part = name, rest = title/position
  function parseAuthor(author: string) {
    const separators = [" - ", " – ", " — "];
    for (const sep of separators) {
      const idx = author.indexOf(sep);
      if (idx !== -1) {
        return { name: author.slice(0, idx).trim(), title: author.slice(idx + sep.length).trim() };
      }
    }
    return { name: author, title: "" };
  }

  // Truncate praise to ~250 chars
  function truncatePraise(text: string, max = 300) {
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
  }

  return (
    <section className="py-8 md:py-12 bg-[#004C3A]">
      <div className="container-wide py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-center text-white mb-14">
          Author Experiences
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 lg:gap-x-16 lg:gap-y-14">
          {displayedReviews.map((review, index) => {
            const { name, title } = parseAuthor(review.author);
            return (
              <div key={index} className="flex gap-5 items-start">
                {review.coverImage && (
                  <div className="flex-shrink-0 w-28 md:w-32 lg:w-36">
                    <img
                      src={review.coverImage}
                      alt={review.bookTitle}
                      className="w-full h-auto shadow-lg rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm leading-relaxed mb-4 text-justify">
                    "{truncatePraise(review.praise)}"
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-[#2dd4bf]">{name}</span>
                    {title && (
                      <span className="text-white/60"> – {title}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < reviews.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="text-white/80 hover:text-white border border-white/30 hover:border-white/60 px-8 py-2.5 text-sm tracking-wider transition-colors rounded-sm"
            >
              SHOW MORE
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
