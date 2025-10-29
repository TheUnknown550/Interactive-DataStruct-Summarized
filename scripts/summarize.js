/* eslint-disable no-console */
// Simple PDF -> Markdown summarizer for course_slides/*.pdf
// Usage: npm run summarize

import fs from 'node:fs';
import path from 'node:path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

const ROOT = process.cwd();
const IN_DIR = path.join(ROOT, 'course_slides');
const OUT_DIR = path.join(ROOT, 'content');
const OUT_FILE = path.join(OUT_DIR, 'summary.md');

async function extractTextFromPdf(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data, disableWorker: true }).promise;
  let text = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => (it.str || ''));
    text += strings.join(' ') + '\n';
  }
  return text.replace(/\s+/g, ' ').trim();
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z(\[])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function pickByKeywords(sentences, keywords, max = 6) {
  const res = [];
  for (const s of sentences) {
    const low = s.toLowerCase();
    if (keywords.some((k) => low.includes(k))) res.push(s);
    if (res.length >= max) break;
  }
  return res;
}

function summarizeText(raw, fallback = {}) {
  const sentences = splitSentences(raw);
  const overview = sentences.slice(0, 6);
  const operations = pickByKeywords(
    sentences,
    ['insert', 'delete', 'remove', 'search', 'push', 'pop', 'enqueue', 'dequeue', 'traverse', 'sort']
  );
  const uses = pickByKeywords(
    sentences,
    ['use', 'application', 'real-world', 'example', 'cache', 'network', 'priority', 'routing', 'autocomplete']
  );
  const complexity = pickByKeywords(sentences, ['o(', 'omega', 'theta', 'complexity', 'amortized']);

  const toBullets = (arr, def) => (arr.length ? arr : def).map((s) => `- ${s}`);

  return {
    overview: overview.length ? overview.join(' ') : fallback.overview || 'Overview not found in slides.',
    operations: toBullets(operations, fallback.operations || ['Operations not detected in slides.']).join('\n'),
    uses: toBullets(uses, fallback.uses || ['Use-cases not detected in slides.']).join('\n'),
    complexity: toBullets(
      complexity,
      fallback.complexity || ['Avg time: O(?)', 'Worst time: O(?)', 'Space: O(?)']
    ).join('\n'),
  };
}

function slugFromFilename(name) {
  return name.toLowerCase().replace(/\.(pdf|pptx?)$/, '').replace(/[^a-z0-9]+/g, '-');
}

const topicHints = {
  array: { overview: 'Arrays provide O(1) access by index.' },
  'linked-list': { overview: 'Linked lists support efficient insert/delete at known nodes.' },
  stack: { overview: 'Stacks are LIFO: push, pop at the top.' },
  queue: { overview: 'Queues are FIFO: enqueue at rear, dequeue at front.' },
  bst: { overview: 'BST keeps keys ordered to enable O(log n) average search.' },
  heap: { overview: 'Heap is a complete binary tree maintaining heap property.' },
  'hash-table': { overview: 'Hash tables map keys to buckets using a hash function.' },
  hash: { overview: 'Hash tables map keys to buckets using a hash function.' },
  graph: { overview: 'Graphs model relationships as vertices and edges.' },
  trie: { overview: 'Trie is a prefix tree for strings.' },
  avl: { overview: 'AVL is a self-balancing BST with rotations keeping height O(log n).' },
};

async function main() {
  if (!fs.existsSync(IN_DIR)) fs.mkdirSync(IN_DIR, { recursive: true });
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(IN_DIR)
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((f) => path.join(IN_DIR, f));

  if (files.length === 0) {
    console.warn('No PDFs found in course_slides/. Writing placeholder summary.');
  }

  let md = '# Course Slide Summaries\n\n';

  if (files.length === 0) {
    md += 'Add PDFs to course_slides/ and run npm run summarize.\n';
  }

  for (const file of files) {
    const base = path.basename(file);
    const slug = slugFromFilename(base);
    console.log('Processing', base);
    try {
      const raw = await extractTextFromPdf(file);
      const summary = summarizeText(raw, topicHints[slug] || {});
      const title = base.replace(/\.[^.]+$/, '');
      md += `## Topic: ${title}\n\n`;
      md += `### Overview\n${summary.overview}\n\n`;
      md += `### Operations\n${summary.operations}\n\n`;
      md += `### Use Cases\n${summary.uses}\n\n`;
      md += `### Complexity\n${summary.complexity}\n\n`;
    } catch (e) {
      console.error('Failed to summarize', base, e);
    }
  }

  fs.writeFileSync(OUT_FILE, md, 'utf8');
  console.log('Wrote', OUT_FILE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
