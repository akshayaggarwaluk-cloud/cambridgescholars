import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function EqualityStatement() {
  const sub = "text-[18px] font-bold text-[#333333] mt-8 mb-3";
  const p = "text-[16px] text-[#333333] leading-[1.7] mb-4";
  const sansStyle = { fontFamily: '"Nunito Sans", sans-serif' } as const;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Equality Statement
          </h1>
          <PageBreadcrumb currentPage="Equality Statement" />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="max-w-7xl mx-auto px-6 md:px-16" style={sansStyle}>
          <p className={p}>
            Cambridge Scholars are committed to being an equal opportunities employer and Publisher. We oppose all forms of unlawful and unfair discrimination. We are committed to promoting equal opportunities and inclusion in the workplace, both as an employer and as a provider of services. We recognise and appreciate that every individual is different. We try to actively support diversity and inclusion.
          </p>

          <h2 className={sub} style={sansStyle}>
            This policy sets out Cambridge Scholars Publishing's policy on equality, diversity and inclusion.
          </h2>

          <h2 className={sub} style={sansStyle}>Our Authors, Editors and Contributors:</h2>
          <p className={p}>As publishers, we aim to treat all authors, editors and contributors with equal respect. Work is considered only on its merits throughout the publication process.</p>
          <p className={p}>Our objective is to publish a diverse and wide range of publications which reflect the communities and world in which we live.</p>
          <p className={p}>Selection procedures for publications will be objective. Each proposal will be reviewed based only upon its individual merits and its potential contribution to its academic field.</p>
          <p className={p}>The criteria for selection will be fair and appropriate.</p>
          <p className={p}>All of our author community will have equal opportunities for support.</p>

          <h2 className={sub} style={sansStyle}>Recruitment and Employees:</h2>
          <p className={p}>Skills, qualifications and experience are the only factors we consider in our recruitment process.</p>
          <p className={p}>Our objective is to have a diverse workforce and our long-term aim is that the composition of our workforce will broadly reflect that of the community. We believe that individuals must be treated on their merits, and that employment-related decisions must be based on job-related criteria such as aptitude and skills.</p>
          <p className={p}>Advertising and recruitment literature will reflect our commitment to equal opportunities. Wherever possible, all vacancies will be advertised simultaneously internally and externally.</p>
          <p className={p}>The recruitment process will not disadvantage disabled people, and reasonable adjustments to the process (particularly at the interview stage) will be considered.</p>
          <p className={p}>The criteria for selection will be fair and appropriate. Each candidate will be assessed according to their capability to carry out the job.</p>
          <p className={p}>Equal pay will be paid for work of equal value, unless there is a genuine material fact that accounts for the variation, such as length of service.</p>
          <p className={p}>Benefits will be offered to all employees equally unless there is a good justification for not doing so. We will try to be flexible and accommodate cultural or religious holidays, or restrictions on hours of work. We will offer flexible working where possible, and where roles allow it.</p>
          <p className={p}>
            If you have any questions in regards to our policies or our commitments, please contact us at{" "}
            <a href="mailto:admin@cambridgescholars.com" className="text-[#C75B2A] hover:underline">
              admin@cambridgescholars.com
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}