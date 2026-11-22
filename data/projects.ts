export type Project = {
  slug: string;
  image: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  contribution: string;
  features: string[];
  technologies: string[];
  github: string | null;
  githubNote: string | null;
  demo: string | null;
  /**
   * Real, measured metrics only (for example accuracy or latency). Left
   * empty on purpose: no number is shown unless it is genuinely measured.
   * Cards always show honest counts derived from the project itself
   * (features, technologies) alongside any metrics added here later.
   */
  metrics?: { label: string; value: number }[];
  /** Optional long-form case study, rendered as headed sections on the project page. */
  caseStudy?: { heading: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: "misbah-ul-huda",
    image: "/projects/misbah-ul-huda.jpg",
    name: "Misbah-ul-Huda — Shia Islamic Companion App",
    tagline: "Installable web app with prayer & Qaza tracking, Tasbeeh and a full Ziyarat library",
    description:
      "A production PWA built around one idea: the prayers you missed matter as much as the ones you pray. Daily prayer tracking with Jafari (Tehran) prayer times, a separate Qaza counter for every prayer — including Namaz-e-Ayat — a Qaza Khatam Plan that projects your finish date, a private ladies' section where period days never count as Qaza, a Tasbeeh counter, and a library of 8 complete Arabic texts with English translation. Installs on a phone like a native app and works offline.",
    problem:
      "Generic prayer apps track today's prayers but forget the missed ones. Tracking Qaza across months — separately for each prayer, with a realistic finish plan, and correctly excluding ladies' period days — had no proper home, and Shia users also need Jafari prayer times and a real Ziyarat/Dua library in the same place.",
    contribution:
      "Designed and built the complete product end to end: the 'Luminous Courtyard' spatial UI, the prayer and Qaza tracking logic, the Qaza Khatam Plan, ladies' cycle handling, the 8-text Arabic + English library, offline PWA support, and the Supabase account and cloud-sync backend with Row Level Security.",
    features: [
      "Daily 5-prayer tracker with Jafari prayer times and progress ring",
      "Per-prayer Qaza counters including Namaz-e-Ayat, with a finish-date Khatam Plan",
      "Ladies' section — cycle days marked privately, never counted as Qaza",
      "Tasbeeh counter with 7 dhikrs and lifetime totals",
      "Library of 8 complete texts in Arabic with English translation — Ziyarat-e-Ashura, Ziyarat-e-Waritha, Dua-e-Kumayl, Dua-e-Nudba, Dua-e-Tawassul, Hadith-e-Kisa, Surah Ya-Sin, Surah Al-Mulk",
      "Hijri calendar with wiladat/shahadat dates, Qibla direction and monthly report",
      "Installable PWA — offline support, home-screen icon, no app store needed",
    ],
    technologies: ["JavaScript", "PWA", "Supabase", "PostgreSQL", "Adhan.js", "GitHub Pages"],
    github: "https://github.com/waki44/islamic-companion",
    githubNote: null,
    demo: "https://waki44.github.io/islamic-companion/",
    caseStudy: [
      {
        heading: "The insight",
        body: "Most prayer apps are built around today's prayers. For many Muslims, though, the real weight is the backlog — months of missed (Qaza) prayers with no count and no plan to clear them. Misbah-ul-Huda was designed backlog-first: count what is owed prayer by prayer, make the number visibly shrink, and turn it into a plan with a finish date instead of a source of guilt.",
      },
      {
        heading: "Design decisions that matter",
        body: "Three decisions shaped the product. First, ladies' period days never count as Qaza — cycle days are a first-class state in the data model, excluded from the automatic Qaza suggestions by design, not patched in later, and the section is privacy-protected on the app switcher. Second, no guilt mechanics: no streaks, no red warnings — a calm 'Luminous Courtyard' interface in crimson, golden amber, warm taupe and near-black navy. Third, content integrity: the library ships complete, verified Arabic texts with English translation, checked segment by segment (Ziyarat-e-Ashura 124 segments, Dua-e-Nudba 222, Dua-e-Kumayl 250) rather than scraped blindly.",
      },
      {
        heading: "Engineering challenges",
        body: "The hardest bug was invisible on desktop: on iPhone, rapidly tapping the Qaza + button triggered Safari's double-tap zoom and wrecked the layout. Safari in standalone PWA mode ignores both touch-action and user-scalable, so the fix is a small JavaScript touchend suppressor that blocks the zoom gesture but re-fires the tap as a click — the count never misses. Updates reach installed users through a stale-while-revalidate service worker, so fixes ship without any app store. The account layer runs on Supabase: Google sign-in plus one JSONB row per user, guarded by Row Level Security policies, which is what makes the public anon key safe to ship in a static app.",
      },
      {
        heading: "The result",
        body: "A live, installable app running entirely on free infrastructure (GitHub Pages + Supabase): a 5-prayer daily tracker with Jafari prayer times, per-prayer Qaza counters including Namaz-e-Ayat, a Khatam Plan with a projected finish date, an auto-Qaza suggestion engine, a Tasbeeh counter, an 8-text Arabic + English library, a Hijri calendar with wiladat/shahadat dates, Qibla direction and a monthly report — no app store, no server to maintain.",
      },
    ],
  },
  {
    slug: "automated-database-code-audit-tool",
    image: "/projects/automated-database-code-audit-tool.jpg",
    name: "Automated Database Code Audit Tool",
    tagline: "Streamlined security and compliance checks for database code",
    description:
      "Developed a tool to streamline security and compliance checks, with automated analysis of database schemas and queries to identify vulnerabilities and optimise performance. Published on GitHub as Autonomous Code Auditor — an AI-powered autonomous agent for auditing source code and identifying security vulnerabilities.",
    problem:
      "Manual review of database schemas and queries makes it easy to miss security and compliance issues, and hard to spot queries that hurt performance.",
    contribution:
      "Developed the audit tool end to end, automating analysis of database schemas and queries to surface vulnerabilities and performance improvements, enhancing database reliability and security.",
    features: [
      "Automated analysis of database schemas",
      "Automated analysis of database queries",
      "Identification of security vulnerabilities",
      "Security and compliance checks",
      "Performance optimisation guidance",
    ],
    technologies: ["Python", "Database Schema Analysis", "Security & Compliance"],
    github: "https://github.com/waki44/Autonomous-code-autitor",
    githubNote: null,
    demo: null,
  },
  {
    slug: "gympro",
    image: "/projects/gympro.jpg",
    name: "GymPro — Gym Management System",
    tagline: "Full-stack gym management with analytics and fee tracking",
    description:
      "Full-stack gym application covering member registration, membership records, fee tracking, expiry alerts, dashboard analytics, workout-category filters, and monthly revenue visualisations.",
    problem:
      "Gyms need a single place to manage members, memberships, and fees, and to see at a glance when memberships expire and how revenue is trending.",
    contribution:
      "Built the full-stack application — React.js frontend, FastAPI backend, and MongoDB data layer — including the analytics dashboard and revenue visualisations.",
    features: [
      "Member registration and membership records",
      "Fee tracking with expiry alerts",
      "Dashboard analytics",
      "Workout-category filters",
      "Monthly revenue visualisations with Recharts",
    ],
    technologies: ["React.js", "FastAPI", "MongoDB", "Tailwind CSS", "Recharts"],
    github: null,
    githubNote: null,
    demo: "https://workout-fee-manager.preview.emergentagent.com/",
  },
  {
    slug: "datanest-ai-assistant",
    image: "/projects/datanest-ai-assistant.jpg",
    name: "DataNest AI Assistant — Desktop AI Operator",
    tagline: "Windows desktop assistant with API-connected LLM workflows",
    description:
      "Windows desktop assistant with a custom GUI and API-connected LLM workflows, built with Python, CustomTkinter, and the Google Gemini API.",
    problem:
      "Desktop users need an approachable, custom interface for working with LLM-powered workflows directly from Windows.",
    contribution:
      "Built the desktop application, including its custom CustomTkinter GUI and the integration with the Google Gemini API for LLM workflows.",
    features: [
      "Custom Windows desktop GUI built with CustomTkinter",
      "API-connected LLM workflows via the Google Gemini API",
      "Desktop AI operator experience in Python",
    ],
    technologies: ["Python", "CustomTkinter", "Google Gemini API"],
    github: "https://github.com/waki44/DataNest-AI-Assistant",
    githubNote: null,
    demo: null,
  },
  {
    slug: "ai-content-detector",
    image: "/projects/ai-content-detector.jpg",
    name: "AI Content Detector — Multimodal Web Application",
    tagline: "Text and image analysis with confidence scores",
    description:
      "Web interface for text and image analysis with confidence scores and explanatory analysis, using the Claude API and Hugging Face Inference API.",
    problem:
      "Checking whether content is AI-generated calls for analysis across both text and images, presented with clear confidence scores and explanations.",
    contribution:
      "Built the multimodal web application, connecting the web interface to the Claude API and Hugging Face Inference API for text and image analysis.",
    features: [
      "Text analysis for AI-generated content",
      "Image analysis for AI-generated content",
      "Confidence scores for each result",
      "Explanatory analysis alongside scores",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Claude API", "Hugging Face Inference API"],
    github: null,
    githubNote: null,
    demo: null,
  },
  {
    slug: "image-caption-generator",
    image: "/projects/image-caption-generator.jpg",
    name: "Image Caption Generator",
    tagline: "BLIP-powered image captioning with an interactive Gradio interface",
    description:
      "Image-caption generation using BLIP inference with an interactive Gradio interface, built with Python, PyTorch, Hugging Face Transformers, and Salesforce BLIP.",
    problem:
      "Generating descriptive captions for images requires running a vision-language model in a way people can easily try and explore interactively.",
    contribution:
      "Built the caption-generation pipeline using Salesforce BLIP inference via Hugging Face Transformers and PyTorch, and wrapped it in an interactive Gradio interface.",
    features: [
      "Image-caption generation using Salesforce BLIP",
      "Model inference with PyTorch and Hugging Face Transformers",
      "Interactive Gradio interface for trying the model",
    ],
    technologies: ["Python", "PyTorch", "Hugging Face Transformers", "Salesforce BLIP", "Gradio"],
    github: null,
    githubNote: null,
    demo: null,
  },
  {
    slug: "rumicloud-share-space",
    image: "/projects/rumicloud-share-space.jpg",
    name: "RumiCloud Share Space — File-Sharing Platform",
    tagline: "Cloud file-sharing prototype with shareable links",
    description:
      "Cloud file-sharing prototype with uploads, shareable links, and file management, built with a full-stack web architecture and cloud-storage integration.",
    problem:
      "Sharing files easily requires simple uploads, shareable links, and straightforward file management in one place.",
    contribution:
      "Built the file-sharing prototype with a full-stack web architecture and cloud-storage integration, using Lovable AI as part of the build.",
    features: ["File uploads", "Shareable links", "File management", "Cloud-storage integration"],
    technologies: ["Full-stack web architecture", "cloud-storage integration", "Lovable AI"],
    github: null,
    githubNote: null,
    demo: "https://preview--rumicloud-share-space.lovable.app/",
  },
  {
    slug: "rag-portfolio-agent",
    image: "/projects/rag-portfolio-agent.jpg",
    name: "RAG Portfolio Agent & LLM Utilities",
    tagline: "Conversational portfolio agent using semantic retrieval and RAG",
    description:
      "Conversational portfolio-agent architecture using semantic retrieval and RAG responses, a local multi-model API-wrapper/testing environment, and Python utilities for file organisation, web scraping, and data processing.",
    problem:
      "Answering questions about a portfolio accurately calls for retrieving the right information semantically rather than relying on a model alone, and LLM utilities need a practical local environment for testing.",
    contribution:
      "Designed and built the conversational portfolio-agent architecture using semantic retrieval and RAG, the local multi-model API-wrapper/testing environment, and the supporting Python utilities.",
    features: [
      "Conversational portfolio agent using semantic retrieval and RAG responses",
      "Local multi-model API-wrapper and testing environment",
      "Python utilities for file organisation",
      "Python utilities for web scraping and data processing",
    ],
    technologies: ["Python", "vector databases", "semantic search", "conversational LLM APIs", "REST APIs"],
    github: null,
    githubNote: null,
    demo: null,
  },
  {
    slug: "ai-sentiment-analyzer",
    image: "/projects/ai-sentiment-analyzer.jpg",
    name: "AI Sentiment Analyzer",
    tagline: "ML web app for customer review sentiment classification",
    description:
      "An end-to-end machine-learning web application that classifies customer reviews into positive or negative sentiments, built with Python, Scikit-Learn, TF-IDF, and Streamlit.",
    problem:
      "Reading and labelling customer reviews manually at scale is slow and inconsistent.",
    contribution:
      "Built the end-to-end pipeline: TF-IDF text vectorisation, a Scikit-Learn sentiment classifier, and a Streamlit web interface for live classification.",
    features: [
      "Positive/negative sentiment classification of customer reviews",
      "TF-IDF text vectorisation with Scikit-Learn",
      "Interactive Streamlit web interface",
    ],
    technologies: ["Python", "Scikit-Learn", "TF-IDF", "Streamlit"],
    github: "https://github.com/waki44/ai-sentiment-analyzer",
    githubNote: null,
    demo: null,
  },
  {
    slug: "fbr-taxengine",
    image: "/projects/fbr-taxengine.jpg",
    name: "FBR TaxEngine — Tax & Wealth Statement CLI",
    tagline: "Pakistan FBR tax calculation CLI engine for salaried and freelancers",
    description:
      "A Pakistan FBR tax calculation and wealth statement CLI engine for salaried individuals and freelancers, designed as an IRIS helper, built in Python.",
    problem:
      "Salaried workers and freelancers in Pakistan need a practical way to compute FBR tax liabilities and prepare wealth-statement figures for IRIS.",
    contribution:
      "Built the CLI engine covering tax calculation and wealth-statement workflows for salaried and freelancer income scenarios.",
    features: [
      "FBR tax calculation for salaried and freelancer profiles",
      "Wealth-statement figure preparation for IRIS",
      "Command-line interface in Python",
    ],
    technologies: ["Python", "CLI"],
    github: "https://github.com/waki44/FBR-TaxEngine",
    githubNote: null,
    demo: null,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
