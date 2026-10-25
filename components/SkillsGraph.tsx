"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { graphEdges, graphNodes, neighborsOf } from "@/data/skills-graph";

const byId = new Map(graphNodes.map((n) => [n.id, n]));

/**
 * Interactive knowledge graph. Nodes float gently (edges follow them,
 * because both are updated from the same animation frame), hovering a node
 * highlights its connections, and clicking one opens its detail panel.
 * No library: one SVG layer for edges plus real buttons for nodes, so the
 * graph stays keyboard-accessible and smooth on mobile.
 */
export default function SkillsGraph() {
  const [selectedId, setSelectedId] = useState("python");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sizeRef = useRef({ w: 1, h: 1 });
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const lineRefs = useRef(new Map<string, SVGLineElement>());

  const activeId = hoveredId ?? selectedId;
  const activeNeighbors = useMemo(() => new Set(neighborsOf(activeId).map((n) => n.id)), [activeId]);
  const selected = byId.get(selectedId) ?? graphNodes[0];
  // The graph only animates while it is actually on screen.
  const visibleRef = useRef(true);

  // Gentle float: each node drifts on a slow sine wave, and every edge
  // endpoint is recomputed from the same offsets, so lines stay attached.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      sizeRef.current = { w: Math.max(r.width, 1), h: Math.max(r.height, 1) };
    });
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(container);
    let raf = 0;
    const loop = (t: number) => {
      // Offscreen: keep the loop alive but skip all transform writes.
      if (visibleRef.current) {
        const time = t / 1000;
      const offsets = new Map<string, { dx: number; dy: number }>();
      graphNodes.forEach((n) => {
        const dx = Math.sin(time * 0.6 + n.phase) * 4;
        const dy = Math.cos(time * 0.5 + n.phase) * 4;
        offsets.set(n.id, { dx, dy });
        const btn = nodeRefs.current.get(n.id);
        if (btn) btn.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
      });
      graphEdges.forEach(([a, b]) => {
        const line = lineRefs.current.get(`${a}-${b}`);
        const na = byId.get(a);
        const nb = byId.get(b);
        const oa = offsets.get(a);
        const ob = offsets.get(b);
        if (!line || !na || !nb || !oa || !ob) return;
        line.setAttribute("x1", String(na.x + (oa.dx / sizeRef.current.w) * 100));
        line.setAttribute("y1", String(na.y + (oa.dy / sizeRef.current.h) * 100));
        line.setAttribute("x2", String(nb.x + (ob.dx / sizeRef.current.w) * 100));
        line.setAttribute("y2", String(nb.y + (ob.dy / sizeRef.current.h) * 100));
      });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 sm:aspect-[16/10]"
      >
        {/* Edges */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {graphEdges.map(([a, b]) => {
            const na = byId.get(a);
            const nb = byId.get(b);
            if (!na || !nb) return null;
            const highlighted = activeId === a || activeId === b;
            return (
              <line
                key={`${a}-${b}`}
                ref={(el) => {
                  if (el) lineRefs.current.set(`${a}-${b}`, el);
                }}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                vectorEffect="non-scaling-stroke"
                className="transition-opacity duration-300"
                stroke={highlighted ? "#22d3ee" : "#3f3f46"}
                strokeWidth={highlighted ? 1.5 : 1}
                opacity={activeId && !highlighted && activeId !== a && activeId !== b ? 0.35 : 1}
              />
            );
          })}
        </svg>
        {/* Nodes */}
        {graphNodes.map((n) => {
          const isActive = n.id === activeId;
          const isNeighbor = activeNeighbors.has(n.id);
          const dimmed = !isActive && !isNeighbor;
          const isCenter = n.id === "python";
          return (
            <button
              key={n.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(n.id, el);
              }}
              type="button"
              aria-pressed={selectedId === n.id}
              aria-label={`Skill: ${n.label}. Connected to ${neighborsOf(n.id).map((x) => x.label).join(", ") || "nothing else"}.`}
              onClick={() => setSelectedId(n.id)}
              onMouseEnter={() => setHoveredId(n.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(n.id)}
              onBlur={() => setHoveredId(null)}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 sm:text-xs ${
                isCenter
                  ? "border-cyan-400 bg-cyan-400 font-bold text-zinc-950 shadow-lg shadow-cyan-400/30"
                  : isActive
                    ? "border-cyan-400 bg-zinc-900 text-cyan-300 shadow-lg shadow-cyan-400/20"
                    : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-500"
              } ${dimmed ? "opacity-40" : "opacity-100"}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">{selected.group}</p>
        <h3 className="mt-1 font-mono text-lg font-bold text-zinc-50">{selected.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{selected.detail}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {neighborsOf(selected.id).map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelectedId(n.id)}
              className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-300 transition hover:border-cyan-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
