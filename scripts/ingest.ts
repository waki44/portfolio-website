import fs from "node:fs";
import path from "node:path";
import { chunkText, type Chunk } from "../lib/rag/chunk";
import { embedTexts } from "../lib/rag/embeddings";
import { sourceNameForKnowledgeFile } from "../lib/rag/store";

const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge");
const OUTPUT_PATH = path.join(process.cwd(), "data", "vector-store.json");
const MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

async function main(): Promise<void> {
  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((file) => file.toLowerCase().endsWith(".md"))
    .sort();

  const chunks: Chunk[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf8");
    chunks.push(...chunkText(content, sourceNameForKnowledgeFile(file)));
  }

  let embeddings: number[][] = chunks.map(() => []);
  if (process.env.OPENAI_API_KEY) {
    embeddings = await embedTexts(chunks.map((chunk) => chunk.text));
    console.log(`Embedded ${embeddings.length} chunks with model ${MODEL}.`);
  } else {
    console.warn(
      "Warning: OPENAI_API_KEY is not set — writing the vector store with empty embeddings. " +
        "The chat API will use keyword search until ingest is re-run with a key.",
    );
  }

  const store = {
    model: MODEL,
    createdAt: new Date().toISOString(),
    chunks: chunks.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index] ?? [],
    })),
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  console.log(`Ingested ${chunks.length} chunks from ${files.length} files into ${OUTPUT_PATH}`);
}

main().catch((error: unknown) => {
  console.error("Ingest failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
