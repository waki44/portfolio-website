import { describe, expect, it } from "vitest";

import { chunkText } from "@/lib/rag/chunk";

const MARKDOWN = `# Profile

Syed Waqar Raza Zaidi is an AI Engineer based in Islamabad, Pakistan.

## Skills

He works with Python, PyTorch, large language models, retrieval-augmented
generation, React, FastAPI, and MongoDB. He builds practical AI tools,
automation scripts, and full-stack web applications for real users.

## Projects

His projects include a data assistant, an AI content detector, a gym
management system, and a portfolio agent powered by retrieval-augmented
generation over his own curriculum vitae and project notes.
`;

describe("chunkText", () => {
  it("returns chunks for normal markdown", () => {
    const chunks = chunkText(MARKDOWN, "profile.md");

    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(0);

    for (const chunk of chunks) {
      expect(typeof chunk.id).toBe("string");
      expect(chunk.id.length).toBeGreaterThan(0);
      expect(chunk.source).toBe("profile.md");
      expect(typeof chunk.text).toBe("string");
      expect(chunk.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("returns multiple chunks for text longer than maxChars", () => {
    const longText = MARKDOWN.repeat(6);
    const chunks = chunkText(longText, "profile.md", 300, 50);

    expect(chunks.length).toBeGreaterThan(1);
  });

  it("gives every chunk an id containing the source, and ids are unique", () => {
    const chunks = chunkText(MARKDOWN.repeat(4), "profile.md", 300, 50);

    expect(chunks.length).toBeGreaterThan(1);

    for (const chunk of chunks) {
      expect(chunk.id).toContain("profile.md");
    }

    const ids = chunks.map((chunk) => chunk.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not exceed maxChars by more than overlap + 50 characters", () => {
    const maxChars = 300;
    const overlap = 50;
    // Small slack (overlap + 50) allows implementations that avoid cutting
    // a word / sentence / markdown heading in half at the exact boundary.
    const limit = maxChars + overlap + 50;

    const chunks = chunkText(MARKDOWN.repeat(6), "profile.md", maxChars, overlap);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(limit);
    }
  });

  it("respects the default size limits", () => {
    const maxChars = 700;
    const overlap = 100;
    const limit = maxChars + overlap + 50;

    const chunks = chunkText(MARKDOWN.repeat(8), "profile.md");

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(limit);
    }
  });

  it("preserves content: joined chunks contain a known sentence", () => {
    const knownSentence =
      "Syed Waqar Raza Zaidi is an AI Engineer based in Islamabad, Pakistan.";
    const text = `# Profile\n\n${knownSentence}\n\nHe builds AI tools and web applications.`;

    const chunks = chunkText(text, "profile.md");
    const joined = chunks.map((chunk) => chunk.text).join("\n");

    expect(joined).toContain(knownSentence);
  });

  it("returns [] for empty text", () => {
    expect(chunkText("", "profile.md")).toEqual([]);
  });

  it("returns [] for whitespace-only text", () => {
    expect(chunkText("   ", "profile.md")).toEqual([]);
    expect(chunkText("\n\n  \t  \n", "profile.md")).toEqual([]);
  });
});
