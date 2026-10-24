"use client";

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
            <h1 id="hero-heading" className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-xl font-medium text-zinc-700 dark:text-zinc-200">{profile.title}</p>
          </div>
        </div>

        <p className="animate-fade-up mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          I build AI-powered applications, LLM integrations, and Python automation tools — alongside full-stack web
          and mobile software that is practical and maintainable. As an AI engineer in Islamabad, Pakistan, I help
          teams turn LLM, RAG, and automation ideas into working products.
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
