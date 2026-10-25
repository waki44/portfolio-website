import Reveal, { SectionHeading } from "./Reveal";
import { education } from "@/data/profile";

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="scroll-mt-20 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading id="education-heading" eyebrow="Education" title="Education" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((item) => (
            <Reveal key={item.qualification} className="h-full">
              <article className="h-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{item.qualification}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.institution}</p>
                {item.detail ? (
                  <p className="mt-3 inline-block rounded-full bg-cyan-950 px-3 py-1 text-xs font-medium text-cyan-300 dark:bg-cyan-950 dark:text-cyan-300">
                    {item.detail}
                  </p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
