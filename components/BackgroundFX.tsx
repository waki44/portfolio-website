/**
 * Animated background for the whole site: slow-drifting gradient blobs
 * plus a very faint grid, fixed behind all content. Pure CSS animation,
 * no JavaScript, and it switches off for prefers-reduced-motion.
 */
export default function BackgroundFX() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Faint grid */}
      <div className="bg-grid absolute inset-0" />
      {/* Drifting gradient blobs */}
      <div className="animate-blob absolute -top-32 left-[8%] h-96 w-96 rounded-full bg-indigo-300/50 blur-3xl dark:bg-indigo-600/25" />
      <div
        className="animate-blob absolute top-[38%] -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-300/50 blur-3xl dark:bg-violet-600/25"
        style={{ animationDelay: "-8s", animationDuration: "26s" }}
      />
      <div
        className="animate-blob absolute -bottom-40 left-[28%] h-96 w-96 rounded-full bg-fuchsia-200/50 blur-3xl dark:bg-fuchsia-600/20"
        style={{ animationDelay: "-16s", animationDuration: "32s" }}
      />
    </div>
  );
}
