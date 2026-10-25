"use client";

import { useEffect, useRef } from "react";

// Sparse, understated motes drifting inside the aurora. Positions, sizes
// and timings are fixed so the layer never re-renders: each mote is one
// span animated purely by CSS. On mobile the last four are hidden by CSS.
const MOTES = [
  { left: "12%", top: "22%", size: 3, color: "#38bdf8", duration: 14, delay: 0 },
  { left: "28%", top: "68%", size: 2, color: "#8b5cf6", duration: 18, delay: 2 },
  { left: "44%", top: "14%", size: 2, color: "#38bdf8", duration: 11, delay: 4 },
  { left: "61%", top: "38%", size: 3, color: "#818cf8", duration: 16, delay: 1 },
  { left: "73%", top: "62%", size: 2, color: "#8b5cf6", duration: 13, delay: 3 },
  { left: "86%", top: "26%", size: 3, color: "#38bdf8", duration: 17, delay: 5 },
  { left: "20%", top: "84%", size: 2, color: "#818cf8", duration: 15, delay: 6 },
  { left: "55%", top: "82%", size: 2, color: "#38bdf8", duration: 12, delay: 2.5 },
];

/**
 * AI Aurora Flow: the site-wide background. Four large, soft, blurred
 * light fields (cyan / violet / indigo / deep blue) drift and morph
 * slowly over a deep midnight-navy base, with a few sparse motes floating
 * inside them. Pure CSS animation — no per-frame React state, no canvas,
 * no new dependencies — so the layer costs almost nothing while idle and
 * never re-renders content. A very subtle mouse parallax (desktop only,
 * pointer:fine) shifts the whole field a few pixels; reduced motion gets
 * the same composition frozen as a static aurora. Fixed, behind all
 * content, pointer-transparent, so it never blocks input or shifts layout.
 */
export default function AuroraBackground() {
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Parallax is deliberately understated (a few pixels) and desktop-only.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }
    const layer = parallaxRef.current;
    if (!layer) return;
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function apply() {
      raf = 0;
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      layer.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      // Keep easing only until settled, then stop: no loop while idle.
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        raf = requestAnimationFrame(apply);
      }
    }
    function onMove(e: MouseEvent) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 16;
      targetY = (e.clientY / window.innerHeight - 0.5) * 12;
      if (!raf) raf = requestAnimationFrame(apply);
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#070b14]"
    >
      {/* Deep base: midnight navy melting into indigo and near-black. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,#101736_0%,transparent_55%),radial-gradient(100%_80%_at_85%_100%,#171233_0%,transparent_60%),linear-gradient(180deg,#070b14_0%,#090d1a_50%,#070b14_100%)]" />
      {/* Parallax layer: aurora fields + motes move together, a few px. */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
        <div className="absolute inset-0">
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="aurora-mote"
              style={{
                left: m.left,
                top: m.top,
                width: m.size,
                height: m.size,
                backgroundColor: m.color,
                animationDuration: `${m.duration}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
