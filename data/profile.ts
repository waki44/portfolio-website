export const profile = {
  name: "Syed Waqar Raza Zaidi",
  initials: "SWZ",
  title: "AI Engineer | Python Automation & Software Developer",
  location: "Islamabad, Pakistan",
  email: "syedwaqarraza27@gmail.com",
  phone: { display: "+92 332-8569629", href: "tel:+923328569629" },
  github: [
    { label: "github.com/waki44", url: "https://github.com/waki44" },
    { label: "github.com/waki_44", url: "https://github.com/waki_44" },
  ],
  photo: "/profile-photo.jpg",
  linkedin: {
    label: "linkedin.com/in/syed-waqar-raza-zaidi-65672b242",
    url: "https://www.linkedin.com/in/syed-waqar-raza-zaidi-65672b242/",
  },
  instagram: {
    label: "instagram.com/waki_44",
    url: "https://www.instagram.com/waki_44/",
  },
  summary:
    "AI Engineer and BS AI student with hands-on experience building AI-powered applications, LLM integrations, computer-vision demos, Python automation tools, and full-stack applications. Experienced with Python, PyTorch, Hugging Face Transformers, FastAPI, REST APIs, and web/mobile interfaces. Long-term goal: specialising in ML engineering. Brings project ownership, team coordination, and a focus on practical, maintainable software.",
  cvPath: "/Syed_Waqar_Raza_Zaidi_CV.pdf",
} as const;

export type SkillGroup = { title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming",
    skills: ["Python", "JavaScript", "TypeScript", "C++", "Java", "Bash", "HTML5", "CSS3"],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      "PyTorch",
      "Hugging Face Transformers",
      "Salesforce BLIP",
      "scikit-learn",
      "model inference",
      "computer vision",
      "NLP",
      "neural networks",
      "transfer learning",
      "prompt engineering",
    ],
  },
  {
    title: "Generative AI & LLMs",
    skills: [
      "LLM API integration",
      "RAG",
      "semantic search",
      "vector databases",
      "conversational AI",
      "local LLM orchestration",
      "agentic workflows",
    ],
  },
  {
    title: "Web, Mobile & UI",
    skills: [
      "React.js",
      "React Native",
      "Expo",
      "Tailwind CSS",
      "Shadcn UI",
      "Android Jetpack Compose",
      "CustomTkinter",
      "Gradio",
    ],
  },
  {
    title: "Backend & Data",
    skills: [
      "FastAPI",
      "REST APIs",
      "MongoDB",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Recharts",
      "Pillow",
      "Requests",
      "web scraping",
      "data processing",
    ],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Google Colab", "Jupyter Notebook", "VirtualBox", "Cursor AI", "Lovable AI"],
  },
];

export type ExperienceItem = {
  role: string;
  organisation: string;
  handle?: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Tech Lead & Content Creator",
    organisation: "Duo Byte AI",
    handle: "@duobyte_AI",
    points: [
      "Created educational technology content covering AI tools, developer utilities, productivity applications, and student resources.",
      "Produced practical tutorials demonstrating AI-assisted tools and software-development workflows.",
    ],
  },
  {
    role: "Academic Project Team Lead",
    organisation: "FUUAST",
    points: [
      "Led teams of 3–4 students, coordinating planning, task allocation, progress, and final delivery.",
      "Reviewed and integrated contributions, resolved implementation issues, and checked deliverables.",
    ],
  },
];

export type EducationItem = {
  qualification: string;
  institution: string;
  detail?: string;
};

export const education: EducationItem[] = [
  {
    qualification: "BS Artificial Intelligence",
    institution: "Federal Urdu University of Arts, Science and Technology (FUUAST), Islamabad",
    detail: "Semester 5 · Expected graduation 2028",
  },
  {
    qualification: "ICS",
    institution: "Federal Board of Intermediate and Secondary Education (FBISE), Islamabad",
  },
];

export const certifications: string[] = [
  "Crash Course on Python — Google / Coursera (Verified)",
  "Python for Data Science, AI & Development — IBM / Coursera (Verified)",
  "Machine Learning Course — Innovista Learn Easy",
  "Critical Thinking in the AI Era — HP LIFE",
  "CS101: Introduction to Programming I — Saylor Academy",
  "ChatGPT and OpenAI API — freeCodeCamp / Cursa",
];

export const languages: { name: string; level: string }[] = [
  { name: "Urdu", level: "Native" },
  { name: "English", level: "Intermediate" },
];
