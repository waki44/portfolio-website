import Reveal, { SectionHeading } from "./Reveal";
import { faqs } from "@/data/faq";

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading id="faq-heading" eyebrow="FAQ" title="Frequently Asked Questions" />
        </Reveal>
        <div className="mx-auto max-w-3xl">
          {faqs.map((faq) => (
            <Reveal key={faq.question}>
              <details className="group border-b border-zinc-200 py-5 dark:border-zinc-800">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-zinc-900 marker:hidden dark:text-zinc-100 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl leading-none text-cyan-500 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
