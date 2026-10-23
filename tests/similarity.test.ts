import { describe, expect, it } from "vitest";

import { cosineSimilarity, topK } from "@/lib/rag/similarity";

describe("cosineSimilarity", () => {
  it("returns 1 (approx) for identical vectors", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 6);
    expect(cosineSimilarity([0.5, -0.25, 4], [0.5, -0.25, 4])).toBeCloseTo(1, 6);
  });

  it("returns 1 (approx) for vectors pointing in the same direction", () => {
    expect(cosineSimilarity([1, 0], [2, 0])).toBeCloseTo(1, 6);
    expect(cosineSimilarity([1, 1], [3, 3])).toBeCloseTo(1, 6);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 6);
    expect(cosineSimilarity([1, 0, 0], [0, 1, 1])).toBeCloseTo(0, 6);
  });

  it("returns -1 (approx) for opposite vectors", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1, 6);
    expect(cosineSimilarity([1, 2, 3], [-1, -2, -3])).toBeCloseTo(-1, 6);
  });

  it("returns 0 for empty arrays", () => {
    expect(cosineSimilarity([], [])).toBe(0);
    expect(cosineSimilarity([], [1, 2, 3])).toBe(0);
    expect(cosineSimilarity([1, 2, 3], [])).toBe(0);
  });

  it("returns 0 for mismatched lengths", () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
    expect(cosineSimilarity([1, 2, 3, 4], [1, 2])).toBe(0);
  });
});

describe("topK", () => {
  const items = [
    { name: "unrelated", embedding: [0, 1] },
    { name: "exact", embedding: [1, 0] },
    { name: "partial", embedding: [1, 1] },
    { name: "opposite", embedding: [-1, 0] },
  ];
  const query = [1, 0];

  it("returns at most k items", () => {
    expect(topK(items, query, 1)).toHaveLength(1);
    expect(topK(items, query, 2)).toHaveLength(2);
    expect(topK(items, query, 3)).toHaveLength(3);
  });

  it("returns items sorted by score descending", () => {
    const results = topK(items, query, 4);

    expect(results.map((result) => result.name)).toEqual([
      "exact",
      "partial",
      "unrelated",
      "opposite",
    ]);

    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("attaches a numeric score field to every result", () => {
    const results = topK(items, query, 2);

    for (const result of results) {
      expect(typeof result.score).toBe("number");
    }
    expect(results[0].score).toBeCloseTo(1, 6);
  });

  it("preserves the original item fields alongside the score", () => {
    const [first] = topK(items, query, 1);

    expect(first.name).toBe("exact");
    expect(first.embedding).toEqual([1, 0]);
  });

  it("returns all items when there are fewer than k", () => {
    const results = topK(items, query, 10);

    expect(results).toHaveLength(items.length);
  });

  it("returns an empty array for empty input", () => {
    expect(topK([], query, 3)).toEqual([]);
  });
});
