import Reveal, { SectionHeading } from "./Reveal";
import { certifications } from "@/data/profile";

export default function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading id="certifications-heading" eyebrow="Certifications" title="Certifications" />
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <Reveal key={cert} as="li" className="h-full">
              <div className="flex h-full items-start gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 dark:bg-cyan-950 dark:text-cyan-300"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
                  </svg>
                </span>
                <p className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">{cert}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
