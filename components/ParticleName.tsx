"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

const COLORS = ["#22d3ee", "#8b5cf6", "#e4e4e7", "#22d3ee"];

/**
 * The hero name as a particle field: small dots fly in once on load and
 * form the name, then stay perfectly still. The earlier mouse-scatter was
 * removed: it made the name burst and flash every time the pointer (or
 * finger) passed over it, which looked bad while reading. Custom canvas
 * code on purpose — no Three.js, no tsParticles — so the effect costs
 * ~150 lines and zero extra dependencies. On mobile the particle count
 * drops automatically, and with reduced motion (or without JavaScript) the
 * plain name is shown instead.
 */
export default function ParticleName() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The hero is only animated while it is actually on screen.
  const visibleRef = useRef(true);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Deferred one frame so the first render matches the server render
    // (static name) and no hydration mismatch occurs.
    const raf = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReducedMotion(true);
      } else {
        setMounted(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Narrowed aliases: callbacks handed to rAF/listeners lose the outer
    // null-check narrowing, so these non-null aliases keep TS happy.
    const canvasEl = canvas;
    const ctx2d = ctx;
    const containerEl = container;

    let particles: Particle[] = [];
    let raf = 0;
    let resizeTimer = 0;

    // Draw the name off-screen, then keep only the pixels that are part
    // of a letter. Those pixels become particle targets.
    function sample() {
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight;
      if (w === 0 || h === 0) return;
      canvasEl.width = w;
      canvasEl.height = h;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return;
      // One line, normal heading size (like the original hero: max 48px),
      // fitted to the container so it never overflows on mobile either.
      const fontSize = Math.min(w / 13.5, 48);
      octx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
      // Left-aligned like the rest of the hero text, so the name sits in
      // its own place instead of floating centered in the column.
      octx.textAlign = "left";
      octx.textBaseline = "middle";
      octx.fillStyle = "#fff";
      octx.fillText(profile.name, 0, h / 2);
      const data = octx.getImageData(0, 0, w, h).data;
      const isMobile = w < 640;
      const step = isMobile ? 3 : 4;
      const cap = isMobile ? 800 : 2000;
      const points: { x: number; y: number }[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 128) points.push({ x, y });
        }
      }
      // Thin out randomly if the name sampled more particles than the cap.
      while (points.length > cap) points.splice(Math.floor(Math.random() * points.length), 1);
      particles = points.map((p) => ({
        // Start near the target, not scattered across the whole canvas:
        // the name assembles quickly and cleanly instead of exploding in.
        x: p.x + (Math.random() - 0.5) * 240,
        y: p.y + (Math.random() - 0.5) * 240,
        tx: p.x,
        ty: p.y,
        vx: 0,
        vy: 0,
        size: 1.2 + Math.random() * 1.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function frame() {
      // Offscreen: keep the loop alive but skip all drawing work, so a
      // scrolled-past hero costs nothing.
      if (visibleRef.current) {
        const w = canvasEl.width;
        const h = canvasEl.height;
        ctx2d.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          // Ease toward the letter shape.
          p.vx += (p.tx - p.x) * 0.06;
          p.vy += (p.ty - p.y) * 0.06;
          p.vx *= 0.9;
          p.vy *= 0.9;
          p.x += p.vx;
          p.y += p.vy;
          // Snap to rest once close and slow: without this the spring
          // keeps wobbling around the target forever, so the name
          // shimmers/flashes instead of sitting still.
          if (
            Math.abs(p.x - p.tx) < 0.6 &&
            Math.abs(p.y - p.ty) < 0.6 &&
            Math.abs(p.vx) < 0.3 &&
            Math.abs(p.vy) < 0.3
          ) {
            p.x = p.tx;
            p.y = p.ty;
            p.vx = 0;
            p.vy = 0;
          }
          ctx2d.fillStyle = p.color;
          ctx2d.fillRect(p.x, p.y, p.size, p.size);
        });
      }
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(sample, 200);
    }

    // Wait a beat for the JetBrains Mono font so letter shapes are sampled
    // in the right typeface; fall back to sampling immediately regardless.
    let cancelled = false;
    let started = false;
    const start = () => {
      if (cancelled || started) return;
      started = true;
      sample();
      raf = requestAnimationFrame(frame);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
      window.setTimeout(start, 800);
    } else {
      start();
    }

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(container);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
    };
  }, [mounted]);

  // Static name: shown on the server, without JavaScript, and for reduced
  // motion. The canvas replaces it only once the browser is ready.
  if (!mounted || reducedMotion) {
    return (
      <h1 id="hero-heading" aria-label={profile.name} className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
        {profile.name}
      </h1>
    );
  }

  return (
    <div ref={containerRef} className="h-[60px] w-full sm:h-[80px]">
      <h1 id="hero-heading" className="sr-only">
        {profile.name}
      </h1>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
