const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "text-embedding-3-small";

function getConfig(): { apiKey: string; baseUrl: string; model: string } {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Set it in the server environment to enable embeddings.",
    );
  }
  return {
    apiKey,
    baseUrl: (process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, ""),
    model: process.env.EMBEDDING_MODEL ?? DEFAULT_MODEL,
  };
}

interface EmbeddingResponseItem {
  index: number;
  embedding: number[];
}

/** Embed a batch of texts in a single provider request. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const { apiKey, baseUrl, model } = getConfig();
  if (texts.length === 0) return [];

  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: texts }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Embedding request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }

  const data = (await response.json()) as { data?: EmbeddingResponseItem[] };
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Embedding response did not contain any embeddings.");
  }

  return [...data.data]
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

/** Embed a single text. */
export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  if (!embedding) {
    throw new Error("Embedding response did not contain an embedding for the input text.");
  }
  return embedding;
}
