import Reveal, { SectionHeading } from "./Reveal";
import { profile, languages } from "@/data/profile";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading id="about-heading" eyebrow="About" title="About me" />
          <div className="grid gap-10 lg:grid-cols-3">
            <p className="max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-200 lg:col-span-2">
              {profile.summary}
            </p>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-300 dark:text-zinc-200">Languages</h3>
              <ul className="mt-4 space-y-3">
                {languages.map((lang) => (
                  <li key={lang.name} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{lang.name}</span>
                    <span className="text-zinc-300 dark:text-zinc-200">{lang.level}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-zinc-300 dark:text-zinc-200">Location</h3>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">{profile.location}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
