export interface Chunk {
  id: string;
  source: string;
  text: string;
}

/**
 * Heading/paragraph-aware chunking.
 *
 * 1. Split the document into blocks: a new block starts at every Markdown
 *    heading and at every blank line.
 * 2. Merge consecutive small blocks together until adding another one would
 *    exceed `maxChars`.
 * 3. Hard-split any single block longer than `maxChars`, carrying `overlap`
 *    characters over into the next piece so context is not lost at the seam.
 *
 * Ids are deterministic: `${source}-${index}` with a 0-based index.
 */
export function chunkText(
  text: string,
  source: string,
  maxChars = 700,
  overlap = 100,
): Chunk[] {
  const limit = maxChars > 0 ? maxChars : 700;
  const overlapChars =
    overlap > 0 && overlap < limit ? overlap : Math.max(0, Math.min(overlap, limit - 1));

  if (!text || !text.trim()) return [];

  // --- 1. Split into heading / paragraph blocks -------------------------
  const blocks: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const joined = current.join("\n").trim();
    if (joined) blocks.push(joined);
    current = [];
  };

  for (const rawLine of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();
    if (/^#{1,6}\s/.test(line.trim())) {
      flush();
      current.push(line.trim());
    } else if (line.trim() === "") {
      flush();
    } else {
      current.push(line);
    }
  }
  flush();

  // --- 2 & 3. Merge small blocks, hard-split long ones ------------------
  const pieces: string[] = [];
  let buffer = "";

  const pushBuffer = () => {
    const trimmed = buffer.trim();
    if (trimmed) pieces.push(trimmed);
    buffer = "";
  };

  const hardSplit = (block: string) => {
    let start = 0;
    while (start < block.length) {
      const end = Math.min(start + limit, block.length);
      const piece = block.slice(start, end).trim();
      if (piece) pieces.push(piece);
      if (end >= block.length) break;
      const nextStart = end - overlapChars;
      // Guarantee forward progress even with a pathological overlap.
      start = nextStart > start ? nextStart : end;
    }
  };

  for (const block of blocks) {
    if (block.length > limit) {
      pushBuffer();
      hardSplit(block);
      continue;
    }
    if (!buffer) {
      buffer = block;
    } else if (buffer.length + 1 + block.length <= limit) {
      buffer = `${buffer}\n${block}`;
    } else {
      pushBuffer();
      buffer = block;
    }
  }
  pushBuffer();

  return pieces.map((piece, index) => ({
    id: `${source}-${index}`,
    source,
    text: piece,
  }));
}
