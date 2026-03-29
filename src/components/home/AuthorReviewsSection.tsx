const authorExperiences = [
  {
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-37.jpg",
    quote:
      "I have worked with many presses, all around the world, and I can say that I have greatly enjoyed working with Cambridge Scholars, and the very fine results. Cambridge Scholars has shown a commitment to advancing the exchange of human knowledge that is clearly very exciting.",
    author: "Professor Graeme Harper",
    authorTitle: "Dean, Honours College, Oakland University",
  },
  {
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-31.jpg",
    quote:
      "I have appreciated and enjoyed, so very much, working with all the wonderful people at Cambridge Scholars; theirs is a great team. Throughout our relationship there only has been graciousness, consideration, and professionalism on their part. Cambridge Scholars are servant leaders of the first order, which distinguishes them from other publishing houses.",
    author: "Dr. Ron D. Petitte",
    authorTitle: "Professor of Politics, Bryan College",
  },
  {
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-311.jpg",
    quote:
      'I would highly recommend working with Cambridge Scholars, who are not afraid to take a chance on an exciting new project and are skilled at providing assistance with all phases of the publication process...They supported me with professional and high quality editing...our cover graphics were a collaboration with an amazing graphics editor; four published books later, it remains my favourite cover ever.',
    author: "Dr. Lynn Zubernis",
    authorTitle: "Clinical Psychologist & Professor, West Chester University",
  },
  {
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-32.jpg",
    quote:
      "I always feel that my knowledge is valued and remains at the forefront of what the final product looks like. Knowing that there is always advice at hand, yet also having a deal of academic freedom has been a refreshing experience. This allows each volume to have its own unique flavor, ensuring that we remain true to our own discipline and the many idiosyncrasies that it entails.",
    author: "Dr. Peter Whiteman",
    authorTitle: "Head of Early Childhood, Macquarie University",
  },
  {
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/9781527567740-2.jpg",
    quote:
      "Thank you very much for all your help. It has been delightful working with you. It has, in fact, been an absolute joy to work with everyone at Cambridge Scholars Publishing throughout the entire publication process. What a gem of a publishing house!",
    author: "Dr. Necip Fikri Alican",
    authorTitle: "Philosopher, ethics & ancient philosophy",
  },
  {
    bookImage:
      "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/image-31.jpg",
    quote:
      "For the opportunity to develop in detail on the page explorations engendered in the classroom, I am grateful—and I encourage (have encouraged) fellows in the academic disciplines to seek out CSP. For Cambridge is, truly, a Scholar's Publisher.",
    author: "Ethan Lewis",
    authorTitle: "Author and lecturer, University of Illinois–Springfield",
  },
];

export function AuthorReviewsSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-wide bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        {/* Section Title */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-center text-foreground mb-14">
          Author Experiences
        </h2>

        {/* Grid - 2 columns */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {authorExperiences.map((exp, index) => (
            <div
              key={index}
              className="flex gap-5 items-start"
            >
              {/* Book Cover */}
              <div className="flex-shrink-0 w-32 md:w-36 lg:w-40">
                <img
                  src={exp.bookImage}
                  alt={`Book by ${exp.author}`}
                  className="w-full h-auto shadow-md"
                />
              </div>

              {/* Quote & Attribution */}
              <div className="flex-1 min-w-0">
                <p className="text-foreground/80 text-sm leading-relaxed mb-4 text-justify">
                  "{exp.quote}"
                </p>
                <p className="text-sm">
                  <span className="font-bold text-accent">{exp.author}</span>
                  <span className="text-foreground/70"> – {exp.authorTitle}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
