import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-600/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-700">
      <div className="relative h-40 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Image
          src={project.image}
          alt={`${project.name} — project thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <Link
            href={`/projects/${project.slug}`}
            className="rounded focus-visible:outline-2 focus-visible:outline-indigo-600 after:absolute after:inset-0"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">{project.tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.technologies.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400" aria-hidden="true">
            View case study →
          </span>
        </div>
      </div>
    </article>
  );
}
