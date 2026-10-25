"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// The homepage sections, in order. Scrolling through them is treated as
// training: each section is one epoch, and the loss falls as you progress.
const EPOCHS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Thin fixed side panel (desktop only): a training loss curve that draws
 * itself as you scroll, plus a live "Epoch x/8 — loss: y" label. The loss
 * value is a visual metaphor derived from scroll progress, not a real
 * training metric.
 */
export default function TrainingPanel() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    // Deferred to the next frame: reading matchMedia is client-only, and
    // applying it synchronously in the effect trips the cascading-render
    // lint rule. One frame of the animated curve is imperceptible.
    const raf = requestAnimationFrame(() =>
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let ticking = false;
    // Last values actually rendered: scroll fires constantly, but the panel
    // only shows progress to 2 decimals and one of 8 epochs, so skip
    // re-renders when neither visible value changed.
    const prev = { p: -1, e: -1 };
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const raw = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      const p = Math.round(raw * 100) / 100;
      if (p !== prev.p) {
        prev.p = p;
        setProgress(p);
      }
      // Current epoch: the last section whose top has crossed the middle
      // of the viewport.
      let current = 0;
      EPOCHS.forEach((ep, i) => {
        const el = document.getElementById(ep.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = i;
      });
      if (current !== prev.e) {
        prev.e = current;
        setEpoch(current);
      }
      // Move the glowing tip dot along the curve (pathLength is normalized
      // to 1, so the scroll fraction maps directly onto the curve).
      const path = pathRef.current;
      const dot = dotRef.current;
      if (path && dot) {
        try {
          const pt = path.getPointAtLength(p);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
        } catch {
          // Older browsers: the dot just stays hidden. Harmless.
        }
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Only the homepage has these sections.
  if (pathname !== "/") return null;

  // Decorative loss value, falling from ~2.60 to ~0.05 across the page.
  const loss = 2.55 * Math.pow(1 - progress, 2) + 0.05;

  return (
    <aside
      aria-label="Reading progress as training epochs"
      className="fixed right-4 top-1/2 z-40 hidden w-[76px] -translate-y-1/2 flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-2 py-4 backdrop-blur lg:flex"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
        Training
      </p>
      <svg viewBox="0 0 48 96" className="h-24 w-12" aria-hidden="true">
        {/* Faint full curve as a track. */}
        <path
          d="M4 4 C 20 10 30 32 34 52 C 38 72 40 84 44 92"
          fill="none"
          stroke="#27272a"
          strokeWidth="2"
        />
        {/* Drawn portion: reveals as you scroll, falling like a loss curve. */}
        <path
          ref={pathRef}
          d="M4 4 C 20 10 30 32 34 52 C 38 72 40 84 44 92"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reducedMotion ? 0 : 1 - progress}
          style={reducedMotion ? undefined : { transition: "stroke-dashoffset 0.2s linear" }}
        />
        {!reducedMotion && <circle ref={dotRef} r="3" fill="#22d3ee" />}
      </svg>
      <p className="text-center font-mono text-[10px] leading-tight text-zinc-200">
        Epoch {epoch + 1}/{EPOCHS.length}
        <span className="mt-0.5 block truncate text-zinc-300">{EPOCHS[epoch].label}</span>
      </p>
      <p className="font-mono text-xs font-semibold text-cyan-300">loss {loss.toFixed(2)}</p>
    </aside>
  );
}
