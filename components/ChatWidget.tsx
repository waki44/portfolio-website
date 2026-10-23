"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

const WELCOME: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm Syed's AI assistant. Ask me about his skills, projects, education or experience.",
};

const SUGGESTED_QUESTIONS = [
  "Summarise Syed's professional background",
  "What programming languages does Syed know?",
  "What AI projects has Syed completed?",
  "Does Syed have leadership experience?",
  "What is Syed's educational background?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onOpenChat() {
      setOpen(true);
    }
    window.addEventListener("open-chat", onOpenChat);
    return () => window.removeEventListener("open-chat", onOpenChat);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: { answer?: string; sources?: string[] } = await res.json();
      const answer = typeof data.answer === "string" && data.answer.trim() ? data.answer : "Sorry, I couldn't generate a response. Please try again.";
      setMessages([...history, { role: "assistant", content: answer, sources: Array.isArray(data.sources) ? data.sources : undefined }]);
    } catch {
      setError("Sorry, the assistant is unavailable right now. Please try again in a moment, or use the contact form instead.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send(input);
  }

  function clearChat() {
    setMessages([WELCOME]);
    setError(null);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with my AI assistant"
        aria-expanded={open}
        aria-controls="chat-panel"
        className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:bottom-6 sm:right-6"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
        </svg>
      </button>

      {open && (
        <section
          id="chat-panel"
          aria-label="Chat with Syed's AI assistant"
          className="fixed inset-x-3 bottom-24 z-[60] flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:inset-x-auto sm:right-6 sm:w-[24rem]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Syed&apos;s AI Assistant</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Ask about skills, projects, education, or experience</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Clear chat
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  }
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 ? (
                    <ul className="mt-2 space-y-0.5 border-t border-zinc-200 pt-2 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      {msg.sources.map((source) => (
                        <li key={source}>Source: {source}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" role="status" aria-label="Assistant is typing">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-3 dark:bg-zinc-900">
                  <span className="typing-dot h-2 w-2 rounded-full bg-zinc-500" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-zinc-500" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-zinc-500" />
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {error}
              </p>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Suggested questions</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="rounded-full border border-zinc-300 px-3 py-1.5 text-left text-xs font-medium text-zinc-700 transition hover:border-indigo-400 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-zinc-200 px-3 py-3 dark:border-zinc-800">
            <label htmlFor="chat-input" className="sr-only">
              Message the AI assistant
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Syed…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex shrink-0 items-center rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}
