"use client";

import { useEffect, useRef } from "react";

type SmokeParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  growth: number;
  age: number;
  life: number;
  sprite: HTMLCanvasElement;
};

/**
 * A small smoke puff around the cursor on every click — anywhere on the
 * site, buttons and tabs included. Built to cost nothing when idle: a
 * single canvas, one animation loop that only runs while puffs are alive
 * and stops the moment the last one fades, pre-rendered soft-circle
 * sprites (no gradients drawn per frame), and at most a handful of
 * particles per click. With reduced motion, no puffs are spawned at all.
 */
export default function ClickSmoke() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvasEl = canvas;
    const ctx2d = ctx;

    // Pre-render the soft smoke sprites once: a radial gradient is slow
    // to draw per particle, but drawing a ready image is cheap.
    function makeSprite(inner: string): HTMLCanvasElement {
      const s = document.createElement("canvas");
      s.width = 64;
      s.height = 64;
      const c = s.getContext("2d");
      if (c) {
        const g = c.createRadialGradient(32, 32, 2, 32, 32, 32);
        g.addColorStop(0, inner);
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
        c.fillStyle = g;
        c.fillRect(0, 0, 64, 64);
      }
      return s;
    }
    const whiteSprite = makeSprite("rgba(244, 244, 245, 0.85)");
    const cyanSprite = makeSprite("rgba(165, 243, 252, 0.8)");

    let particles: SmokeParticle[] = [];
    let raf = 0;
    let running = false;

    function resize() {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
    }
    resize();

    function frame() {
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
      particles = particles.filter((p) => p.age < p.life);
      if (particles.length === 0) {
        running = false;
        return;
      }
      particles.forEach((p) => {
        p.age += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // smoke rises gently
        p.size += p.growth;
        const fade = 1 - p.age / p.life;
        ctx2d.globalAlpha = fade * 0.5;
        ctx2d.drawImage(p.sprite, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      });
      ctx2d.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function onClick(e: MouseEvent) {
      // Keyboard-activated clicks report 0,0 (no cursor there) — skip them.
      if (e.clientX <= 0 && e.clientY <= 0) return;
      for (let i = 0; i < 7; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.9;
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: 6 + Math.random() * 4,
          growth: 0.4 + Math.random() * 0.4,
          age: 0,
          life: 40 + Math.floor(Math.random() * 15),
          sprite: Math.random() < 0.3 ? cyanSprite : whiteSprite,
        });
      }
      // Cap the total so frantic clicking can never pile up work.
      if (particles.length > 140) particles = particles.slice(-140);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }

    window.addEventListener("click", onClick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] block h-full w-full"
    />
  );
}
