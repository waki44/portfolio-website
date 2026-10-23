import fs from "node:fs";
import path from "node:path";
import { chunkText, type Chunk } from "./chunk";

export interface VectorStore {
  model: string;
  chunks: (Chunk & { embedding: number[] })[];
}

export const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge");
export const VECTOR_STORE_PATH = path.join(process.cwd(), "data", "vector-store.json");

/**
 * Citation name for a knowledge file, e.g. `projects.md` -> `CV — Projects`.
 * Used by both the ingest script and keyword search so citations agree.
 */
export function sourceNameForKnowledgeFile(filename: string): string {
  const base = filename.replace(/\.md$/i, "");
  const title = base
    .split(/[-_]/)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
  return `CV — ${title}`;
}

let cachedStore: VectorStore | null = null;

/**
 * Load data/vector-store.json (read once and cached). Returns an empty store
 * when the file does not exist yet or cannot be parsed, so callers can fall
 * back to keyword search.
 */
export function loadVectorStore(): VectorStore {
  if (cachedStore) return cachedStore;

  try {
    const raw = fs.readFileSync(VECTOR_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<VectorStore>;
    cachedStore = {
      model: typeof parsed.model === "string" ? parsed.model : "",
      chunks: Array.isArray(parsed.chunks)
        ? parsed.chunks.map((chunk) => ({
            id: String(chunk.id ?? ""),
            source: String(chunk.source ?? ""),
            text: String(chunk.text ?? ""),
            embedding: Array.isArray(chunk.embedding) ? chunk.embedding : [],
          }))
        : [],
    };
  } catch {
    cachedStore = { model: "", chunks: [] };
  }
  return cachedStore;
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "is", "are", "was", "were",
  "what", "which", "who", "whom", "does", "do", "did", "has", "have", "had",
  "his", "her", "he", "she", "him", "they", "them", "their", "it", "its",
  "for", "with", "on", "at", "by", "about", "tell", "me", "please", "can",
  "you", "your", "any", "all", "list", "give", "show",
  "know", "explain", "relevant", "most", "best", "main", "get", "use",
  "used", "using", "work", "worked", "working", "also", "much", "many",
  "summarise", "summarize", "summary", "overview", "describe", "background",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9@.+]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    // Crude singularisation so "projects" matches "project" on both sides.
    .map((token) =>
      token.length > 3 && token.endsWith("s") && !token.endsWith("ss")
        ? token.slice(0, -1)
        : token,
    );
}

/**
 * Loose token match for keyword search: exact match, or a shared prefix of
 * at least 5 characters (so "educational" matches "education" and
 * "technologies" matches "technology").
 */
function tokensMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i >= 5;
}

/** Load and chunk every knowledge markdown file (used by keyword search). */
export function loadKnowledgeChunks(): Chunk[] {
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(KNOWLEDGE_DIR)
      .filter((file) => file.toLowerCase().endsWith(".md"))
      .sort();
  } catch {
    return [];
  }

  const chunks: Chunk[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf8");
      chunks.push(...chunkText(content, sourceNameForKnowledgeFile(file)));
    } catch {
      // Skip unreadable files; other sections can still answer.
    }
  }
  return chunks;
}

/**
 * Keyword fallback retrieval: chunk the knowledge markdown files and score
 * each chunk by how many distinct query tokens it contains. Returns the top
 * `k` chunks with score > 0, best first.
 */
export function keywordSearch(
  query: string,
  k: number,
): { text: string; source: string; score: number }[] {
  if (!query || !query.trim() || k <= 0) return [];

  const queryTokens = [...new Set(tokenize(query))];
  if (queryTokens.length === 0) return [];

  return loadKnowledgeChunks()
    .map((chunk) => {
      const chunkTokenList = tokenize(chunk.text);
      const matchedTokens = queryTokens.filter((token) =>
        chunkTokenList.some((chunkToken) => tokensMatch(token, chunkToken)),
      );
      // Bonus when query tokens match the chunk's CV section name, so a
      // "projects" question ranks the Projects section above incidental
      // mentions of the word in other sections.
      const sourceTokens = tokenize(chunk.source);
      const sourceMatches = queryTokens.filter((token) =>
        sourceTokens.some((sourceToken) => tokensMatch(token, sourceToken)),
      ).length;
      const occurrences = chunkTokenList.filter((token) =>
        matchedTokens.some((matched) => tokensMatch(matched, token)),
      ).length;
      return {
        text: chunk.text,
        source: chunk.source,
        matched: matchedTokens.length,
        score: matchedTokens.length / queryTokens.length,
        rank: matchedTokens.length * 10 + sourceMatches * 5 + occurrences * 0.1,
      };
    })
    // Require a meaningful match — at least two distinct query tokens, or
    // at least half of them — so a single incidental word (e.g. "team")
    // cannot produce a false answer.
    .filter((result) => result.matched >= 2 || result.score >= 0.5)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, k)
    .map(({ text, source, score }) => ({ text, source, score }));
}
