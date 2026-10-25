import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/#projects"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
      >
        ← Back to projects
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{project.name}</h1>
        <p className="mt-2 text-lg font-medium text-indigo-600 dark:text-indigo-400">{project.tagline}</p>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-200">{project.description}</p>
      </header>

      <div className="relative mt-8 aspect-[2/1] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <Image
          src={project.image}
          alt={`${project.name} — project thumbnail`}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {project.githubNote ? project.githubNote : "View on GitHub"}
          </a>
        ) : null}
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            View live demo
          </a>
        ) : null}
        {!project.github && !project.demo ? (
          <p className="text-sm text-zinc-300 dark:text-zinc-200">No public repository or live demo link provided for this project yet.</p>
        ) : null}
      </div>
      {project.github && project.githubNote ? (
        <p className="mt-3 text-sm text-zinc-300 dark:text-zinc-200">
          Note: an exact repository URL was not provided — the button above links to the GitHub profile.
        </p>
      ) : null}

      <section aria-labelledby="project-problem" className="mt-12">
        <h2 id="project-problem" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          The problem
        </h2>
        <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-200">{project.problem}</p>
      </section>

      <section aria-labelledby="project-contribution" className="mt-10">
        <h2 id="project-contribution" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          My contribution
        </h2>
        <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-200">{project.contribution}</p>
      </section>

      <section aria-labelledby="project-features" className="mt-10">
        <h2 id="project-features" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Key features
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-200">
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="project-tech" className="mt-10">
        <h2 id="project-tech" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Technologies
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies used">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
