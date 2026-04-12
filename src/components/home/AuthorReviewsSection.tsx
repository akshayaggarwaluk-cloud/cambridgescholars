const authorExperiences: { bookImage: string; quote: string; author: string; authorTitle: string }[] = [];

export function AuthorReviewsSection() {
  if (authorExperiences.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container-wide bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-center text-foreground mb-14">
          Author Experiences
        </h2>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {authorExperiences.map((exp, index) => (
            <div key={index} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-32 md:w-36 lg:w-40">
                <img src={exp.bookImage} alt={`Book by ${exp.author}`} className="w-full h-auto shadow-md" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm leading-relaxed mb-4 text-justify">"{exp.quote}"</p>
                <p className="text-sm">
                  <span className="font-bold text-accent">{exp.author}</span>
                  <span className="text-muted-foreground"> – {exp.authorTitle}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
