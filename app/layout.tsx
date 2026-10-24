import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { profile } from "@/data/profile";

const siteUrl = "https://portfolio-website-sigma-ashen-90.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    "AI Engineer in Islamabad",
    "AI Engineer Islamabad Pakistan",
    "AI Engineer",
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
  jobTitle: "AI Engineer",
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

// Runs before first paint: applies the saved/system theme to avoid FOUC.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
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
