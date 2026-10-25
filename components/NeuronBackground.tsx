"use client";

import { useEffect, useRef } from "react";

type Neuron = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  phase: number;
};

const COLORS = ["#22d3ee", "#8b5cf6", "#e4e4e7"];

/**
 * Neuron-network background for the whole site: softly glowing nodes
 * joined by synapse-like lines, drifting slowly behind all content. Built
 * for the dark theme — cyan/violet light on near-black — and kept faint so
 * text stays readable. No library, one canvas, node count scaled to screen
 * size. With reduced motion it draws a single static frame and stops.
 */
export default function NeuronBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Narrowed aliases: callbacks handed to rAF/listeners lose the outer
    // null-check narrowing, so these non-null aliases keep TS happy.
    const canvasEl = canvas;
    const ctx2d = ctx;

    let nodes: Neuron[] = [];
    let raf = 0;
    let resizeTimer = 0;

    function init() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasEl.width = w;
      canvasEl.height = h;
      const isMobile = w < 640;
      const cap = isMobile ? 40 : 90;
      const count = Math.max(24, Math.min(cap, Math.floor((w * h) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 1.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(time: number) {
      const w = canvasEl.width;
      const h = canvasEl.height;
      ctx2d.clearRect(0, 0, w, h);
      const linkDist = w < 640 ? 110 : 130;
      // Synapse lines between nearby neurons.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.28;
            ctx2d.strokeStyle = a.color === "#e4e4e7" ? `rgba(228, 228, 231, ${alpha})` : `rgba(34, 211, 238, ${alpha})`;
            ctx2d.lineWidth = 1;
            ctx2d.beginPath();
            ctx2d.moveTo(a.x, a.y);
            ctx2d.lineTo(b.x, b.y);
            ctx2d.stroke();
          }
        }
      }
      // Nodes: soft halo + bright core, gently pulsing.
      nodes.forEach((n) => {
        const pulse = 1 + Math.sin(time / 1000 + n.phase) * 0.3;
        ctx2d.fillStyle = n.color === "#8b5cf6" ? "rgba(139, 92, 246, 0.10)" : "rgba(34, 211, 238, 0.10)";
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, n.r * 4 * pulse, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.fillStyle = n.color;
        ctx2d.globalAlpha = 0.9;
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.globalAlpha = 1;
      });
    }

    function frame(time: number) {
      const w = canvasEl.width;
      const h = canvasEl.height;
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;
      });
      draw(time);
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(init, 200);
    }

    init();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
}
