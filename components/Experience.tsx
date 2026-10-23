import Reveal, { SectionHeading } from "./Reveal";
import { experience } from "@/data/profile";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-20 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading id="experience-heading" eyebrow="Experience" title="Experience" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {experience.map((item) => (
            <Reveal key={`${item.role}-${item.organisation}`} className="h-full">
              <article className="h-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{item.role}</h3>
                <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {item.organisation}
                  {item.handle ? <span className="text-zinc-500 dark:text-zinc-400"> · {item.handle}</span> : null}
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
