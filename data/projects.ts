export type Project = {
  slug: string;
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
};

export const projects: Project[] = [
  {
    slug: "automated-database-code-audit-tool",
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
    slug: "fbr-wala",
    name: "FBR Wala — Tax & Wealth Statement CLI",
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
    github: "https://github.com/waki44/fbr-wala",
    githubNote: null,
    demo: null,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
