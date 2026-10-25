import Reveal, { SectionHeading } from "./Reveal";
import SkillsGraph from "./SkillsGraph";
import { skillGroups } from "@/data/profile";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="skills-heading"
            eyebrow="Skills"
            title="Technical skills"
            description="An interactive map of the tools I work with — hover a node to see what connects to it, click it for details."
          />
        </Reveal>
        <Reveal>
          <SkillsGraph />
        </Reveal>
        {/* Full skill list, kept compact below the graph so nothing a
            recruiter might search for is lost. */}
        <Reveal className="mt-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">Full skill set</p>
          <div className="space-y-4">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-semibold text-zinc-400">{group.title}</p>
                <ul className="flex flex-wrap gap-1.5" aria-label={`${group.title} skills`}>
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
