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
 * The hero name as a particle field: thousands of small dots form the name,
 * scatter when the mouse (or finger) comes near, and reassemble afterwards.
 * Custom canvas code on purpose — no Three.js, no tsParticles — so the
 * effect costs ~150 lines and zero extra dependencies. On mobile the
 * particle count drops automatically, and with reduced motion (or without
 * JavaScript) the plain name is shown instead.
 */
export default function ParticleName() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
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
      const fontSize = Math.min(w / 7, 120);
      octx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#fff";
      octx.fillText("Syed Waqar", w / 2, h / 2 - fontSize * 0.55);
      octx.fillText("Raza Zaidi", w / 2, h / 2 + fontSize * 0.55);
      const data = octx.getImageData(0, 0, w, h).data;
      const isMobile = w < 640;
      const step = isMobile ? 6 : 4;
      const cap = isMobile ? 900 : 2600;
      const points: { x: number; y: number }[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 128) points.push({ x, y });
        }
      }
      // Thin out randomly if the name sampled more particles than the cap.
      while (points.length > cap) points.splice(Math.floor(Math.random() * points.length), 1);
      particles = points.map((p) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        tx: p.x,
        ty: p.y,
        vx: 0,
        vy: 0,
        size: 1.2 + Math.random() * 1.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function frame() {
      const w = canvasEl.width;
      const h = canvasEl.height;
      ctx2d.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;
      particles.forEach((p) => {
        // Ease back toward the letter shape.
        p.vx += (p.tx - p.x) * 0.06;
        p.vy += (p.ty - p.y) * 0.06;
        // Scatter when the pointer comes close.
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 && dist > 0.01) {
            const force = ((90 - dist) / 90) * 5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        ctx2d.fillStyle = p.color;
        ctx2d.fillRect(p.x, p.y, p.size, p.size);
      });
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      const r = canvasEl.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onTouch(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const r = canvasEl.getBoundingClientRect();
      mouseRef.current = { x: t.clientX - r.left, y: t.clientY - r.top };
    }
    function onLeave() {
      mouseRef.current = null;
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
    container.addEventListener("mousemove", onMove);
    container.addEventListener("touchmove", onTouch, { passive: true });
    container.addEventListener("mouseleave", onLeave);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("touchmove", onTouch);
      container.removeEventListener("mouseleave", onLeave);
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
    <div ref={containerRef} className="h-[220px] w-full sm:h-[260px]">
      <h1 id="hero-heading" className="sr-only">
        {profile.name}
      </h1>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
