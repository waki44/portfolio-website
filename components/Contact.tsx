"use client";

import { useState, type FormEvent } from "react";
import Reveal, { SectionHeading } from "./Reveal";
import { profile } from "@/data/profile";

type Status = { kind: "idle" | "submitting" | "success" | "error"; message: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — real visitors never fill this
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  function validate(): boolean {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name (at least 2 characters).";
    if (!emailPattern.test(email.trim())) next.email = "Please enter a valid email address.";
    if (message.trim().length < 10) next.message = "Please enter a message of at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ kind: "submitting", message: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim(), company }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus({ kind: "success", message: "Thank you — your message has been sent. I will get back to you soon." });
      setName("");
      setEmail("");
      setMessage("");
      setCompany("");
      setErrors({});
    } catch {
      setStatus({
        kind: "error",
        message: `Something went wrong sending your message. Please try again, or email me directly at ${profile.email}.`,
      });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
  const errorClass = "mt-1.5 text-sm text-red-600 dark:text-red-400";

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-20 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Get in touch"
            description="Interested in working together, or have a question about my projects? Send a message or reach me directly."
          />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Email</h3>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-1 block break-all text-base font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Phone</h3>
                <a
                  href={profile.phone.href}
                  className="mt-1 block text-base font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
                >
                  {profile.phone.display}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">GitHub</h3>
                <ul className="mt-1 space-y-1">
                  {profile.github.map((g) => (
                    <li key={g.url}>
                      <a
                        href={g.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
                      >
                        {g.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">LinkedIn</h3>
                <a
                  href={profile.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-base font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
                >
                  {profile.linkedin.label}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Instagram</h3>
                <a
                  href={profile.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-base font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
                >
                  {profile.instagram.label}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Location</h3>
                <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">{profile.location}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={inputClass}
                    placeholder="Your name"
                  />
                  {errors.name ? (
                    <p id="contact-name-error" role="alert" className={errorClass}>
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                  {errors.email ? (
                    <p id="contact-email-error" role="alert" className={errorClass}>
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={inputClass}
                  placeholder="How can I help?"
                />
                {errors.message ? (
                  <p id="contact-message-error" role="alert" className={errorClass}>
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {/* Honeypot: hidden from people, catches bots. Do not remove. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden" style={{ position: "absolute" }}>
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {status.kind === "success" ? (
                <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {status.message}
                </p>
              ) : null}
              {status.kind === "error" ? (
                <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                  {status.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status.kind === "submitting"}
                className="mt-6 inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.kind === "submitting" ? "Sending…" : "Send message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
