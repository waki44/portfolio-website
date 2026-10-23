import Link from "next/link";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{profile.name}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {profile.title} · {profile.location}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="text-zinc-600 transition hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
              >
                Email
              </a>
            </li>
            {profile.github.map((g) => (
              <li key={g.url}>
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 transition hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
                >
                  {g.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/#projects"
                className="text-zinc-600 transition hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-zinc-200 py-4 dark:border-zinc-800">
        <p className="mx-auto max-w-6xl px-4 text-xs text-zinc-500 dark:text-zinc-500 sm:px-6 lg:px-8">
          © 2026 {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
