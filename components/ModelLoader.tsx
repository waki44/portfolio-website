"use client";

import { useEffect, useRef, useState } from "react";

// sessionStorage is temporary browser memory: it clears when the tab
// closes, so the loader shows only once per browser session.
const SESSION_KEY = "model-loader-shown";

type Stage = "pending" | "show" | "fading" | "done";

export default function ModelLoader() {
  const [stage, setStage] = useState<Stage>("pending");
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);
  // Click-to-skip lives in JSX, but the finish logic lives in the effect,
  // so it is shared through a ref.
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Read browser-only state after mount, and apply it on the next frame
    // (deferred setState keeps React's cascading-render lint rule happy).
    const timersList = timers.current;
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      alreadyShown = false;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Repeat visits in the same session, and users who prefer less motion,
    // never see the loader at all — "pending" already renders nothing, so
    // no state change is needed on this path.
    if (alreadyShown || reducedMotion) return;

    const showRaf = requestAnimationFrame(() => setStage("show"));
    document.body.style.overflow = "hidden";

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Private mode etc: loader just shows again next visit. Harmless.
      }
      // Restore scrolling HERE, not only in the effect cleanup: returning
      // null does not unmount this component, so the cleanup below would
      // never run after a normal finish — and the page would stay
      // scroll-locked forever. That was a real bug: the loader vanished
      // but the page could not scroll afterwards.
      document.body.style.overflow = "";
      setStage("done");
    };
    finishRef.current = finish;

    const step = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 2 + Math.random() * 4);
        if (next >= 100) {
          window.clearInterval(step);
          // "Model ready" pauses briefly, then the screen fades/slides away.
          timersList.push(window.setTimeout(() => setStage("fading"), 550));
          timersList.push(window.setTimeout(finish, 1150));
        }
        return next;
      });
    }, 40);
    timersList.push(step);

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(showRaf);
      window.clearInterval(step);
      timersList.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = "";
    };
  }, []);

  // Render nothing until the effect decides, so repeat visits never flash
  // the loader for a frame before it is dismissed.
  if (stage === "pending" || stage === "done") return null;

  return (
    <div
      onClick={() => finishRef.current()}
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] px-6 transition-all duration-500 ${
        stage === "fading" ? "-translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md font-mono text-sm sm:text-base">
        <p className="text-zinc-500">&gt; boot sequence initiated</p>
        {progress > 15 && (
          <p className="mt-2 text-cyan-300">&gt; loading weights ... {Math.floor(progress)}%</p>
        )}
        {progress > 55 && <p className="mt-2 text-zinc-400">&gt; compiling knowledge graph ...</p>}
        {progress >= 100 && <p className="mt-2 text-emerald-400">&gt; model ready</p>}
        <p className="mt-6" aria-hidden="true">
          <span className="inline-block h-4 w-2 animate-pulse bg-cyan-300" />
        </p>
        <div className="mt-4 h-1 w-full overflow-hidden rounded bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-8 text-xs text-zinc-600">click or press any key to skip</p>
      </div>
    </div>
  );
}
