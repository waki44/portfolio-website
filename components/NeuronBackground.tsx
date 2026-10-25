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

// An expanding ring around a neuron that just fired: the visible "this
// one activated" moment, readable even in a screenshot.
type Ring = {
  n: Neuron;
  age: number;
};

const COLORS = ["#22d3ee", "#8b5cf6", "#e4e4e7"];

/**
 * A real neural network as the site background — not random stars. Neurons
 * sit in vertical layers (input → hidden → output) spanning the viewport,
 * in strict rows, wired only to the same row of the next layer, so
 * connections run as clean parallel bands with zero crossings — and each
 * column sits in a soft vertical glow band, so the eye groups nodes into
 * layers instead of following lines. Bright signals race along the
 * connections as gradient streaks, and every neuron a signal reaches
 * flashes, ripples a ring, and usually fires a signal of its own down the
 * line, so the whole net looks busy and fast. Dark-theme colours
 * (cyan/violet on near-black), faint enough to keep text readable. With
 * reduced motion it draws one static frame and stops.
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
    let rings: Ring[] = [];
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
      rings = [];
      const layers: Neuron[][] = [];
      for (let l = 0; l < layerCount; l++) {
        const x = marginX + (l * (w - marginX * 2)) / (layerCount - 1);
        const count = Math.max(3, Math.min(6, Math.round(h / 150)));
        const layer: Neuron[] = [];
        for (let i = 0; i < count; i++) {
          // Tiny jitter only: rows must stay aligned across layers, or
          // the columns stop reading as columns.
          const y =
            marginY + (i * (h - marginY * 2)) / (count - 1) + (Math.random() - 0.5) * 8;
          const n: Neuron = {
            baseX: x,
            baseY: y,
            x,
            y,
            r: 2.5 + Math.random() * 1.0,
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
      // Wire each neuron ONLY to the same row of the next layer. Any
      // neighbour-row wiring made lines cross into X shapes, and crossed
      // lines are exactly what made the network read as a random web
      // instead of clean layers. Same-row wiring gives zero crossings:
      // parallel horizontal bands between distinct columns.
      for (let l = 0; l < layers.length - 1; l++) {
        const targets = layers[l + 1];
        layers[l].forEach((n, i) => {
          edges.push({ a: n, b: targets[i] });
        });
      }
    }

    function draw() {
      const w = canvasEl.width;
      const h = canvasEl.height;
      ctx2d.clearRect(0, 0, w, h);
      // Soft vertical glow bands behind each column: without them the
      // eye follows the long horizontal lines and the columns vanish.
      // The bands are what group the nodes into visible layers.
      const layerXs = [...new Set(neurons.map((n) => n.baseX))].sort((a, b) => a - b);
      layerXs.forEach((x) => {
        const band = ctx2d.createLinearGradient(x - 55, 0, x + 55, 0);
        band.addColorStop(0, "rgba(34, 211, 238, 0)");
        band.addColorStop(0.5, "rgba(34, 211, 238, 0.05)");
        band.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx2d.fillStyle = band;
        ctx2d.fillRect(x - 55, 0, 110, h);
      });
      // Connections: faint enough that nodes, not lines, dominate.
      const activeEdges = new Set(pulses.map((p) => p.edge));
      edges.forEach((e) => {
        const active = activeEdges.has(e);
        ctx2d.strokeStyle = active ? "rgba(34, 211, 238, 0.6)" : "rgba(148, 163, 184, 0.22)";
        ctx2d.lineWidth = active ? 1.2 : 1;
        ctx2d.beginPath();
        ctx2d.moveTo(e.a.x, e.a.y);
        ctx2d.lineTo(e.b.x, e.b.y);
        ctx2d.stroke();
      });
      // Signals as true streaks: a gradient line segment from just behind
      // the head to the head itself. Discrete dots read as beads; a
      // streak reads as motion even frozen in a screenshot.
      pulses.forEach((p) => {
        const t0 = Math.max(0, p.t - 0.18);
        const x0 = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * t0;
        const y0 = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * t0;
        const x1 = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * p.t;
        const y1 = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * p.t;
        const streak = ctx2d.createLinearGradient(x0, y0, x1, y1);
        streak.addColorStop(0, "rgba(165, 243, 252, 0)");
        streak.addColorStop(1, "rgba(165, 243, 252, 0.9)");
        ctx2d.strokeStyle = streak;
        ctx2d.lineWidth = 2.5;
        ctx2d.beginPath();
        ctx2d.moveTo(x0, y0);
        ctx2d.lineTo(x1, y1);
        ctx2d.stroke();
        ctx2d.fillStyle = "rgba(165, 243, 252, 0.5)";
        ctx2d.beginPath();
        ctx2d.arc(x1, y1, 10, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.fillStyle = "#ecfeff";
        ctx2d.beginPath();
        ctx2d.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx2d.fill();
      });
      // Firing rings: expanding circles around neurons that just fired.
      // Thick and bright, so a firing neuron stands out from its
      // neighbours even in a still frame.
      rings.forEach((r) => {
        ctx2d.strokeStyle = `rgba(34, 211, 238, ${(1 - r.age / 30) * 0.8})`;
        ctx2d.lineWidth = 2;
        ctx2d.beginPath();
        ctx2d.arc(r.n.x, r.n.y, 4 + r.age * 1.0, 0, Math.PI * 2);
        ctx2d.stroke();
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
        ctx2d.arc(n.x, n.y, n.r * (1 + n.flash * 1.5), 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.globalAlpha = 1;
      });
    }

    function frame(time: number) {
      // Tiny bob in place: rows and columns stay aligned, nothing wanders
      // off its layer.
      neurons.forEach((n) => {
        n.x = n.baseX + Math.sin(time / 1800 + n.phase) * 3;
        n.y = n.baseY + Math.cos(time / 1500 + n.phase) * 3;
        n.flash = Math.max(0, n.flash - 0.03);
      });
      rings.forEach((r) => {
        r.age += 1;
      });
      rings = rings.filter((r) => r.age < 30);
      // New signals several times a second, up to ~40 in flight at once.
      // Fast: each crossing takes ~0.3s, so traffic visibly races rather
      // than drifts.
      if (time - lastSpawn > 70 && pulses.length < 40 && edges.length > 0) {
        lastSpawn = time;
        pulses.push({
          edge: edges[Math.floor(Math.random() * edges.length)],
          t: 0,
          speed: 0.04 + Math.random() * 0.02,
        });
      }
      const next: Pulse[] = [];
      pulses.forEach((p) => {
        p.t += p.speed;
        if (p.t >= 1) {
          // Arrival: the target neuron fires (flash + ring), and usually
          // forwards a signal of its own — chains of activity ripple
          // through layers.
          p.edge.b.flash = 1;
          rings.push({ n: p.edge.b, age: 0 });
          const outgoing = edges.filter((e) => e.a === p.edge.b);
          if (outgoing.length > 0 && Math.random() < 0.6) {
            next.push({
              edge: outgoing[Math.floor(Math.random() * outgoing.length)],
              t: 0,
              speed: 0.04 + Math.random() * 0.02,
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
