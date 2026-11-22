import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Leadership from "@/components/Leadership";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { faqs } from "@/data/faq";

// FAQPage structured data: lets Google match this page to the question
// searches recruiters and clients actually type ("who is…", "can he…",
// "how do I contact…") and show the answers directly in results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Leadership />
      <Education />
      <Certifications />
      <Faq />
      <Contact />
    </>
  );
}
