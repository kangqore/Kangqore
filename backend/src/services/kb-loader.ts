import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import yaml from 'js-yaml';
import logger from '../utils/logger';

// Inline frontmatter parser — replaces gray-matter to avoid js-yaml v3/v4 conflict
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  try {
    const data = (yaml.load(match[1]) as Record<string, any>) ?? {};
    return { data, content: match[2] };
  } catch {
    return { data: {}, content: match[2] };
  }
}

export interface KBChunk {
  id: string;
  parentId: string;
  sourceFile: string;
  title: string;
  tags: string[];
  body: string;
  populated: boolean;
  internal: boolean;
  contentHash: string;
}

export interface KBIndex {
  chunks: Map<string, KBChunk>;
  publicChunks: KBChunk[];
  parentDocs: Map<string, KBChunk>;
  forbiddenSubstrings: string[];
  loadedAt: Date;
}

const KB_DIR = path.resolve(__dirname, '../../knowledge-base');

let cached: KBIndex | null = null;

function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}

interface ParsedFile {
  parent: KBChunk;
  children: KBChunk[];
}

function splitBySections(parentId: string, body: string): { title: string; body: string }[] {
  const lines = body.split('\n');
  const sections: { title: string; body: string }[] = [];
  let currentTitle = parentId;
  let currentBody: string[] = [];
  for (const line of lines) {
    const m = line.match(/^#{1,3}\s+(.+?)\s*$/);
    if (m) {
      if (currentBody.length > 0 && currentBody.join('').trim()) {
        sections.push({ title: currentTitle, body: currentBody.join('\n').trim() });
      }
      currentTitle = m[1];
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentBody.length > 0 && currentBody.join('').trim()) {
    sections.push({ title: currentTitle, body: currentBody.join('\n').trim() });
  }
  return sections;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function parseFile(filePath: string): ParsedFile | null {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = parseFrontmatter(raw);
  if (!data.id || !data.title) {
    logger.warn(`KB file missing id/title in frontmatter: ${filePath}`);
    return null;
  }
  const parentId = String(data.id);
  const trimmedBody = content.trim();
  const populated = data.populated !== false;
  const internal = data.internal === true;
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const sourceFile = path.basename(filePath);

  const parent: KBChunk = {
    id: parentId,
    parentId,
    sourceFile,
    title: String(data.title),
    tags,
    body: trimmedBody,
    populated,
    internal,
    contentHash: hash(trimmedBody),
  };

  if (!populated || internal) {
    return { parent, children: [] };
  }

  const sections = splitBySections(parentId, trimmedBody);
  const children: KBChunk[] = [];
  if (sections.length <= 1) {
    children.push(parent);
  } else {
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const id = `${parentId}#${slugify(sec.title) || `s${i}`}`;
      children.push({
        id,
        parentId,
        sourceFile,
        title: `${parent.title} — ${sec.title}`,
        tags,
        body: sec.body,
        populated: true,
        internal: false,
        contentHash: hash(sec.body),
      });
    }
  }
  return { parent, children };
}

function extractForbiddenSubstrings(body: string): string[] {
  const items: string[] = [];
  const lines = body.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s+(.+?)\s*$/);
    if (m) {
      const cleaned = m[1].replace(/^["']|["']$/g, '').trim();
      if (cleaned.length >= 3 && !cleaned.startsWith('<')) {
        items.push(cleaned);
      }
    }
  }
  return items;
}

export function loadKB(): KBIndex {
  if (cached) return cached;
  return reloadKB();
}

export function reloadKB(): KBIndex {
  const chunks = new Map<string, KBChunk>();
  const parentDocs = new Map<string, KBChunk>();
  let forbiddenSubstrings: string[] = [];

  if (!fs.existsSync(KB_DIR)) {
    logger.warn(`KB directory not found: ${KB_DIR}`);
    cached = {
      chunks,
      publicChunks: [],
      parentDocs,
      forbiddenSubstrings,
      loadedAt: new Date(),
    };
    return cached;
  }

  const files = fs.readdirSync(KB_DIR).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const parsed = parseFile(path.join(KB_DIR, file));
    if (!parsed) continue;
    parentDocs.set(parsed.parent.id, parsed.parent);
    if (parsed.parent.id === '_forbidden_claims') {
      forbiddenSubstrings = extractForbiddenSubstrings(parsed.parent.body);
    }
    for (const child of parsed.children) {
      chunks.set(child.id, child);
    }
  }

  const publicChunks = Array.from(chunks.values()).filter(
    (c) => !c.internal && c.populated
  );

  cached = {
    chunks,
    publicChunks,
    parentDocs,
    forbiddenSubstrings,
    loadedAt: new Date(),
  };

  logger.info(
    `KB loaded: ${chunks.size} chunks across ${parentDocs.size} files (${publicChunks.length} public/populated, ${forbiddenSubstrings.length} forbidden substrings)`
  );

  return cached;
}

export function getKB(): KBIndex {
  return loadKB();
}

export function isPopulated(chunkId: string): boolean {
  const kb = loadKB();
  const c = kb.chunks.get(chunkId);
  return Boolean(c && c.populated && !c.internal);
}

export function isPopulatedParent(parentId: string): boolean {
  const kb = loadKB();
  const p = kb.parentDocs.get(parentId);
  return Boolean(p && p.populated && !p.internal);
}
