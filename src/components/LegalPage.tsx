import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

type Doc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export function LegalPage({ doc }: { doc: Doc }) {
  return (
    <>
      <SiteHeader home={false} />
      <main id="main" className="wrap pb-20 pt-8 md:pt-14">
        <article className="max-w-[68ch]">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{doc.updated}</p>
          <h1 className="mt-3 font-serif text-[clamp(44px,6vw,80px)] leading-none tracking-tight">{doc.title}</h1>
          <p className="mt-6 text-lg">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-2 leading-relaxed text-muted">{p}</p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
