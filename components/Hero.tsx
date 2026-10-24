"use client";

import { Fragment } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";

export function openChat() {
  window.dispatchEvent(new CustomEvent("open-chat"));
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="animate-fade-up flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <Image
            src={profile.photo}
            alt="Portrait of Syed Waqar Raza Zaidi"
            width={224}
            height={224}
            priority
            className="h-24 w-24 shrink-0 rounded-3xl object-cover object-top shadow-lg sm:h-28 sm:w-28"
          />
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {profile.location}
            </p>
            <h1
              id="hero-heading"
              aria-label={profile.name}
              className="hero-name text-4xl font-bold tracking-tight sm:text-5xl"
            >
              {(() => {
                // Group letters by word and keep each word unbreakable, so the
                // name wraps between words ("Raza Zaidi") and never inside
                // one ("Zaid" / "i"). Previously every space was a non-breaking
                // space, so the whole name was one long word and the browser
                // broke it between letters, orphaning the final "i".
                let letterIndex = 0;
                const words = profile.name.split(" ");
                return words.map((word, wi) => (
                  <Fragment key={wi}>
                    <span className="hero-name-word">
                      {word.split("").map((letter, li) => {
                        const delay = 0.15 + letterIndex++ * 0.045;
                        return (
                          <span
                            key={li}
                            aria-hidden="true"
                            className="hero-name-letter"
                            style={{ animationDelay: `${delay}s` }}
                          >
                            {letter}
                          </span>
                        );
                      })}
                    </span>
                    {wi < words.length - 1 ? " " : null}
                  </Fragment>
                ));
              })()}
            </h1>
            <p className="hero-portfolio mt-3 text-sm font-bold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-400">
              Portfolio
            </p>
            <p className="animate-fade-up mt-3 text-xl font-medium text-zinc-700 dark:text-zinc-200">
              {profile.displayTitle}
            </p>
          </div>
        </div>

        <p className="animate-fade-up mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          As a Python developer and AI engineer, I build AI-powered applications, LLM integrations, and Python
          automation tools — alongside full-stack web and mobile software that is practical and maintainable. I
          help teams turn LLM, RAG, and automation ideas into working products.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View My Projects
          </a>
          <a
            href={profile.cvPath}
            download
            className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Download CV
          </a>
          <button
            type="button"
            onClick={openChat}
            className="inline-flex items-center rounded-full border border-indigo-600 px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-950"
          >
            Chat With My AI Assistant
          </button>
        </div>
      </div>
    </section>
  );
}
