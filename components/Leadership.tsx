import Reveal, { SectionHeading } from "./Reveal";

const highlights = [
  {
    title: "Tech Lead & Content Creator — Duo Byte AI",
    text: "Created educational technology content covering AI tools, developer utilities, productivity applications, and student resources, and produced practical tutorials demonstrating AI-assisted tools and software-development workflows.",
  },
  {
    title: "Academic Project Team Lead — FUUAST",
    text: "Led teams of 3–4 students, coordinating planning, task allocation, progress, and final delivery.",
  },
  {
    title: "Review, integration & delivery",
    text: "Reviewed and integrated team contributions, resolved implementation issues, and checked deliverables before final delivery.",
  },
  {
    title: "Project ownership",
    text: "Brings project ownership, team coordination, and a focus on practical, maintainable software to every build.",
  },
];

export default function Leadership() {
  return (
    <section id="leadership" aria-labelledby="leadership-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="leadership-heading"
            eyebrow="Leadership"
            title="Leadership & achievements"
            description="Leading teams, teaching through content, and owning delivery end to end."
          />
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2">
          {highlights.map((item) => (
            <Reveal key={item.title} as="li" className="h-full">
              <div className="h-full rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
