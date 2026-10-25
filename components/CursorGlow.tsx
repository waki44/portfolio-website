"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Soft neon glow that follows the mouse (desktop only). It never replaces
 * the real cursor — it is a light that trails behind it. Disabled on touch
 * devices and for users who prefer reduced motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;
    // Enable on the next frame so the glow div exists before the loop
    // writes to it (and to keep setState out of the synchronous effect).
    const enableRaf = requestAnimationFrame(() => setEnabled(true));

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    // Ease toward the mouse instead of snapping to it: the glow lags
    // slightly behind, which is what makes it feel like light, not a dot.
    const loop = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate(${x - 160}px, ${y - 160}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(enableRaf);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[2] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
    />
  );
}
