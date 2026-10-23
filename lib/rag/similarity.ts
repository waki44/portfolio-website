/**
 * Cosine similarity between two vectors.
 * Returns 0 for empty vectors, mismatched lengths, or zero-magnitude vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Return the `k` items whose embeddings are most similar to `query`,
 * each annotated with its `score`, sorted by score descending.
 */
export function topK<T extends { embedding: number[] }>(
  items: T[],
  query: number[],
  k: number,
): (T & { score: number })[] {
  if (!items || items.length === 0 || k <= 0) return [];
  return items
    .map((item) => ({ ...item, score: cosineSimilarity(item.embedding, query) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
}
