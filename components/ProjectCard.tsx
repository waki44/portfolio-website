"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import CountUp from "./CountUp";

/**
 * Project card as a "model card": 3D tilt following the mouse, a soft neon
 * glow behind it on hover, and metric counters that count up when the card
 * enters the screen. Tilt is desktop-only and disabled for reduced motion.
 * Metrics are honest counts from the project itself plus any real measured
 * metrics added to the project data later — never invented numbers.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const tiltEnabled = useRef(false);

  useEffect(() => {
    tiltEnabled.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function onMove(e: React.MouseEvent) {
    const card = cardRef.current;
    if (!card || !tiltEnabled.current) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
  }

  function onLeave() {
    const card = cardRef.current;
    if (card) card.style.transform = "";
  }

  const metrics = [
    ...(project.metrics ?? []),
    { label: "Features", value: project.features.length },
    { label: "Technologies", value: project.technologies.length },
  ];

  return (
    <div className="group relative h-full">
      {/* Soft neon glow behind the card, visible on hover. */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-violet-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <article
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-[border-color,box-shadow] duration-300 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-400/10 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-cyan-500"
      >
        <div className="relative aspect-[2/1] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
          <Image
            src={project.image}
            alt={`${project.name} — project thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <Link
              href={`/projects/${project.slug}`}
              className="rounded focus-visible:outline-2 focus-visible:outline-cyan-400 after:absolute after:inset-0"
            >
              {project.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm font-medium text-cyan-400 dark:text-cyan-300">{project.tagline}</p>
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
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800/70">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="font-mono text-xl font-bold text-cyan-300">
                  <CountUp value={m.value} />
                </p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-5">
            <span className="text-sm font-semibold text-cyan-400 dark:text-cyan-300" aria-hidden="true">
              View case study →
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
