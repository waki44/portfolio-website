"use client";

import { useEffect, useRef } from "react";

type Neuron = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  r: number;
  color: string;
  phase: number;
  // 0..1: how strongly this neuron is firing right now. Set to 1 when a
  // signal arrives, then decays — the flash is what makes the net look
  // like it is thinking, not just sitting there.
  flash: number;
  layer: number;
};

type Edge = {
  a: Neuron;
  b: Neuron;
};

// A signal racing along one connection.
type Pulse = {
  edge: Edge;
  t: number;
  speed: number;
};

const COLORS = ["#22d3ee", "#8b5cf6", "#e4e4e7"];

/**
 * A real neural network as the site background — not random stars. Neurons
 * sit in vertical layers (input → hidden → output) spanning the viewport,
 * wired to the next layer, bobbing gently in place so the structure stays
 * readable. Bright signals race along the connections many times a second,
 * and every neuron a signal reaches flashes and usually fires a signal of
 * its own down the line, so the whole net looks busy and fast. Dark-theme
 * colours (cyan/violet on near-black), faint enough to keep text readable.
 * With reduced motion it draws one static frame and stops.
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

    let neurons: Neuron[] = [];
    let edges: Edge[] = [];
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
      const layerCount = isMobile ? 4 : 6;
      const marginX = w * 0.07;
      const marginY = h * 0.12;
      neurons = [];
      edges = [];
      pulses = [];
      const layers: Neuron[][] = [];
      for (let l = 0; l < layerCount; l++) {
        const x = marginX + (l * (w - marginX * 2)) / (layerCount - 1);
        const count = Math.max(3, Math.min(6, Math.round(h / 150)));
        const layer: Neuron[] = [];
        for (let i = 0; i < count; i++) {
          const y =
            marginY + (i * (h - marginY * 2)) / (count - 1) + (Math.random() - 0.5) * 36;
          const n: Neuron = {
            baseX: x,
            baseY: y,
            x,
            y,
            r: 1.5 + Math.random() * 0.8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            phase: Math.random() * Math.PI * 2,
            flash: 0,
            layer: l,
          };
          layer.push(n);
          neurons.push(n);
        }
        layers.push(layer);
      }
      // Wire each neuron to 2–3 neurons of the next layer (never the whole
      // layer: a full mesh would be unreadable noise).
      for (let l = 0; l < layers.length - 1; l++) {
        const targets = layers[l + 1];
        layers[l].forEach((n) => {
          const k = Math.min(targets.length, 2 + Math.floor(Math.random() * 2));
          const shuffled = [...targets].sort(() => Math.random() - 0.5);
          for (let i = 0; i < k; i++) edges.push({ a: n, b: shuffled[i] });
        });
      }
    }

    function draw() {
      const w = canvasEl.width;
      const h = canvasEl.height;
      ctx2d.clearRect(0, 0, w, h);
      // Connections: faint normally, brighter while a signal rides them.
      const activeEdges = new Set(pulses.map((p) => p.edge));
      edges.forEach((e) => {
        const active = activeEdges.has(e);
        ctx2d.strokeStyle = active ? "rgba(34, 211, 238, 0.45)" : "rgba(148, 163, 184, 0.16)";
        ctx2d.lineWidth = active ? 1.2 : 1;
        ctx2d.beginPath();
        ctx2d.moveTo(e.a.x, e.a.y);
        ctx2d.lineTo(e.b.x, e.b.y);
        ctx2d.stroke();
      });
      // Signals racing along connections.
      pulses.forEach((p) => {
        const x = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * p.t;
        const y = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * p.t;
        ctx2d.fillStyle = "rgba(165, 243, 252, 0.35)";
        ctx2d.beginPath();
        ctx2d.arc(x, y, 6, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.fillStyle = "#ecfeff";
        ctx2d.beginPath();
        ctx2d.arc(x, y, 2, 0, Math.PI * 2);
        ctx2d.fill();
      });
      // Neurons: halo + core; a firing neuron glows bigger and whiter.
      neurons.forEach((n) => {
        const glow = 0.1 + n.flash * 0.5;
        ctx2d.fillStyle =
          n.color === "#8b5cf6" ? `rgba(139, 92, 246, ${glow})` : `rgba(34, 211, 238, ${glow})`;
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, n.r * 4 * (1 + n.flash * 1.5), 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.fillStyle = n.flash > 0.3 ? "#ecfeff" : n.color;
        ctx2d.globalAlpha = 0.9;
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, n.r * (1 + n.flash), 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.globalAlpha = 1;
      });
    }

    function frame(time: number) {
      // Gentle bob in place: the network stays readable, nothing wanders
      // off its layer.
      neurons.forEach((n) => {
        n.x = n.baseX + Math.sin(time / 1800 + n.phase) * 6;
        n.y = n.baseY + Math.cos(time / 1500 + n.phase) * 8;
        n.flash = Math.max(0, n.flash - 0.03);
      });
      // New signals several times a second, up to ~30 in flight at once.
      if (time - lastSpawn > 100 && pulses.length < 30 && edges.length > 0) {
        lastSpawn = time;
        pulses.push({
          edge: edges[Math.floor(Math.random() * edges.length)],
          t: 0,
          speed: 0.02 + Math.random() * 0.015,
        });
      }
      const next: Pulse[] = [];
      pulses.forEach((p) => {
        p.t += p.speed;
        if (p.t >= 1) {
          // Arrival: the target neuron fires, and usually forwards a
          // signal of its own — chains of activity ripple through layers.
          p.edge.b.flash = 1;
          const outgoing = edges.filter((e) => e.a === p.edge.b);
          if (outgoing.length > 0 && Math.random() < 0.6) {
            next.push({
              edge: outgoing[Math.floor(Math.random() * outgoing.length)],
              t: 0,
              speed: 0.02 + Math.random() * 0.015,
            });
          }
        } else {
          next.push(p);
        }
      });
      pulses = next;
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(init, 200);
    }

    init();
    if (reduced) {
      draw();
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
