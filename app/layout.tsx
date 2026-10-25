import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ModelLoader from "@/components/ModelLoader";
import TrainingPanel from "@/components/TrainingPanel";
import NeuronBackground from "@/components/NeuronBackground";
import { profile } from "@/data/profile";

const siteUrl = "https://portfolio-website-sigma-ashen-90.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// JetBrains Mono: monospace for headings, labels, and terminal-style text.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.summary,
  verification: {
    google: "UJN524NbaFLvwblfhlseRRld4NwQKsaiJz9QtUCwjiQ",
  },
  keywords: [
    "Syed Waqar Raza Zaidi",
    "Waqar Zaidi",
    "Waqar Raza Zaidi",
    "AI Engineer",
    "AI Engineer in Islamabad",
    "AI Engineer Islamabad Pakistan",
    "Python developer",
    "Python developer in Islamabad",
    "Python developer Pakistan",
    "Python automation developer",
    "Software developer",
    "Machine Learning engineer",
    "ML engineer",
    "RAG developer",
    "LLM developer",
    "FastAPI developer",
    "React developer",
    "Python",
    "Machine Learning",
    "LLM",
    "RAG",
    "FastAPI",
    "React",
    "Islamabad",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: `${profile.name} — ${profile.title}`,
    description: profile.summary,
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 600, alt: `${profile.name} — AI Engineer, Portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.summary,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

// Structured data: tells Google / recruiter search tools exactly who this
// person is, what he does, and which profiles are his (sameAs disambiguates
// him from other people named Waqar Zaidi).
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: ["Waqar Zaidi", "Syed Waqar Zaidi", "Waqar Raza Zaidi"],
  jobTitle: "AI Engineer",
  hasOccupation: [
    { "@type": "Occupation", name: "AI Engineer" },
    { "@type": "Occupation", name: "Python Developer" },
    { "@type": "Occupation", name: "Software Developer" },
  ],
  description: profile.summary,
  url: siteUrl,
  email: profile.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Islamabad",
    addressCountry: "PK",
  },
  workLocation: {
    "@type": "City",
    name: "Islamabad, Pakistan",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Federal Urdu University of Arts, Sciences & Technology (FUUAST)",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Python",
    "Python development",
    "Software development",
    "AI engineering",
    "PyTorch",
    "Large Language Models",
    "RAG",
    "FastAPI",
    "React",
  ],
  sameAs: [
    profile.linkedin.url,
    "https://github.com/waki44",
    profile.instagram.url,
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // "dark" is permanent: the redesign is a dark-only theme, so the
      // dark: variants below always apply and no theme toggle is needed.
      className={`${geistSans.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#050505] font-sans text-zinc-100">
        <ModelLoader />
        <TrainingPanel />
        <NeuronBackground />
        {/* Film-grain texture overlay, above content but below the loader. */}
        <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[90]" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
