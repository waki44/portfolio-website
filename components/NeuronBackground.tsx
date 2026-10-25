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

// A signal travelling from one neuron to a neighbour: this is what makes
// the network visibly "do something" instead of just twinkling.
type Pulse = {
  a: Neuron;
  b: Neuron;
  t: number;
  speed: number;
};

const COLORS = ["#22d3ee", "#8b5cf6", "#e4e4e7"];

/**
 * Neuron-network background for the whole site: softly glowing nodes
 * joined by synapse-like lines, with bright signal pulses travelling along
 * connections. Built for the dark theme — cyan/violet light on near-black —
 * and kept faint so text stays readable. No library, one canvas, node count
 * scaled to screen size. With reduced motion it draws a single static frame
 * and stops.
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
    let pulses: Pulse[] = [];
    let raf = 0;
    let resizeTimer = 0;
    let lastSpawn = 0;

    function init() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasEl.width = w;
      canvasEl.height = h;
      const isMobile = w < 640;
      const cap = isMobile ? 30 : 60;
      const count = Math.max(20, Math.min(cap, Math.floor((w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 1.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      }));
      pulses = [];
    }

    function draw(time: number) {
      const w = canvasEl.width;
      const h = canvasEl.height;
      ctx2d.clearRect(0, 0, w, h);
      const linkDist = w < 640 ? 110 : 130;
      const linkDistSq = linkDist * linkDist;
      // Synapse lines between nearby neurons (squared-distance check, so
      // the expensive square root runs only for pairs already in range).
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistSq) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / linkDist) * 0.38;
            ctx2d.strokeStyle =
              a.color === "#e4e4e7" ? `rgba(228, 228, 231, ${alpha})` : `rgba(34, 211, 238, ${alpha})`;
            ctx2d.lineWidth = 1;
            ctx2d.beginPath();
            ctx2d.moveTo(a.x, a.y);
            ctx2d.lineTo(b.x, b.y);
            ctx2d.stroke();
          }
        }
      }
      // Travelling signal pulses: bright dots moving along connections.
      pulses.forEach((p) => {
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx2d.fillStyle = "rgba(165, 243, 252, 0.35)";
        ctx2d.beginPath();
        ctx2d.arc(x, y, 6, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.fillStyle = "#ecfeff";
        ctx2d.beginPath();
        ctx2d.arc(x, y, 2, 0, Math.PI * 2);
        ctx2d.fill();
      });
      // Nodes: soft halo + bright core, gently pulsing.
      nodes.forEach((n) => {
        const pulse = 1 + Math.sin(time / 1000 + n.phase) * 0.3;
        ctx2d.fillStyle = n.color === "#8b5cf6" ? "rgba(139, 92, 246, 0.12)" : "rgba(34, 211, 238, 0.12)";
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
      // Spawn a new signal every ~450ms from a random neuron to one of its
      // current neighbours, so traffic is always moving through the net.
      const linkDist = w < 640 ? 110 : 130;
      if (time - lastSpawn > 450 && pulses.length < 12 && nodes.length > 1) {
        lastSpawn = time;
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const neighbours = nodes.filter((n) => {
          if (n === a) return false;
          const dx = n.x - a.x;
          const dy = n.y - a.y;
          return dx * dx + dy * dy < linkDist * linkDist;
        });
        if (neighbours.length > 0) {
          pulses.push({
            a,
            b: neighbours[Math.floor(Math.random() * neighbours.length)],
            t: 0,
            speed: 0.008 + Math.random() * 0.008,
          });
        }
      }
      pulses.forEach((p) => {
        p.t += p.speed;
      });
      pulses = pulses.filter((p) => p.t <= 1);
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
