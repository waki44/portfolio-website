// Skills knowledge graph: one file to edit. Positions are percentages of
// the graph container (x: left→right, y: top→bottom). Edges are pairs of
// node ids that are genuinely used together in Waqar's work.

export type GraphNode = {
  id: string;
  label: string;
  group: string;
  detail: string;
  x: number;
  y: number;
  /** Animation phase so nodes do not all float in sync. */
  phase: number;
};

export const graphNodes: GraphNode[] = [
  { id: "python", label: "Python", group: "Core", detail: "The base of almost everything here — automation tools, API backends, and ML pipelines.", x: 50, y: 50, phase: 0 },
  { id: "pytorch", label: "PyTorch", group: "ML", detail: "Model inference and training, including the BLIP image-captioning pipeline.", x: 26, y: 26, phase: 1.3 },
  { id: "huggingface", label: "Hugging Face", group: "ML", detail: "Transformers and inference APIs behind captioning and content-detection work.", x: 68, y: 22, phase: 2.1 },
  { id: "sklearn", label: "scikit-learn", group: "ML", detail: "Classic ML: TF-IDF vectorisation and the customer-review sentiment classifier.", x: 24, y: 70, phase: 3.0 },
  { id: "llms", label: "LLMs", group: "GenAI", detail: "LLM API integration, conversational workflows, and multi-model testing setups.", x: 72, y: 52, phase: 0.7 },
  { id: "rag", label: "RAG", group: "GenAI", detail: "Semantic retrieval over a vector store — the same approach this portfolio's own chatbot uses.", x: 52, y: 82, phase: 1.9 },
  { id: "nlp", label: "NLP", group: "ML", detail: "Text classification and sentiment pipelines that separate real signal from noise.", x: 28, y: 46, phase: 2.6 },
  { id: "vision", label: "Computer Vision", group: "ML", detail: "Computer vision: image captioning with Salesforce BLIP.", x: 46, y: 20, phase: 3.8 },
  { id: "fastapi", label: "FastAPI", group: "Backend", detail: "REST API backends, including the GymPro server.", x: 78, y: 78, phase: 1.1 },
  { id: "react", label: "React", group: "Frontend", detail: "Frontends for full-stack apps — including this portfolio.", x: 84, y: 44, phase: 2.9 },
  { id: "mongodb", label: "MongoDB", group: "Backend", detail: "Data layer for GymPro memberships, fees, and analytics.", x: 62, y: 88, phase: 0.4 },
  { id: "typescript", label: "TypeScript", group: "Core", detail: "Typed frontends and safer refactors across React work.", x: 16, y: 88, phase: 3.4 },
];

export const graphEdges: [string, string][] = [
  ["python", "pytorch"],
  ["python", "sklearn"],
  ["python", "fastapi"],
  ["pytorch", "huggingface"],
  ["pytorch", "vision"],
  ["huggingface", "vision"],
  ["huggingface", "llms"],
  ["llms", "rag"],
  ["llms", "nlp"],
  ["nlp", "sklearn"],
  ["fastapi", "mongodb"],
  ["fastapi", "react"],
  ["react", "typescript"],
];

export function neighborsOf(id: string): GraphNode[] {
  const ids = new Set<string>();
  graphEdges.forEach(([a, b]) => {
    if (a === id) ids.add(b);
    if (b === id) ids.add(a);
  });
  return graphNodes.filter((n) => ids.has(n.id));
}
