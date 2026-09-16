const path = require('path');
const ApiError = require('../utils/ApiError');
const documentService = require('./document.service');

const SUPPORTED_EXTENSIONS = ['.txt', '.md'];

/**
 * Splits inline text on "**bold**" and "*italic*" (or "_italic_") markers
 * into TipTap text nodes with marks. Deliberately simple — nested/overlapping
 * emphasis is not supported, which is an acceptable limitation for a docs
 * import.
 */
function parseInline(text) {
  if (!text) return [];

  const tokens = text.split(/(\*\*.+?\*\*|\*.+?\*|_.+?_)/g).filter((t) => t.length > 0);

  return tokens.map((token) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return { type: 'text', text: token.slice(2, -2), marks: [{ type: 'bold' }] };
    }
    if (
      (token.startsWith('*') && token.endsWith('*')) ||
      (token.startsWith('_') && token.endsWith('_'))
    ) {
      return { type: 'text', text: token.slice(1, -1), marks: [{ type: 'italic' }] };
    }
    return { type: 'text', text: token };
  });
}

function paragraph(text) {
  const inline = parseInline(text);
  return { type: 'paragraph', content: inline.length ? inline : undefined };
}

function heading(level, text) {
  const inline = parseInline(text);
  return { type: 'heading', attrs: { level }, content: inline.length ? inline : undefined };
}

function listItem(text) {
  return { type: 'listItem', content: [paragraph(text)] };
}

/**
 * Minimal line-based Markdown -> TipTap JSON converter covering headings,
 * bullet/numbered lists, bold and italic — the subset the editor's toolbar
 * actually supports.
 */
function markdownToTiptap(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const content = [];
  let currentList = null; // { type: 'bulletList' | 'orderedList', items: [] }

  const flushList = () => {
    if (currentList) {
      content.push({ type: currentList.type, content: currentList.items });
      currentList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === '') {
      flushList();
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushList();
      content.push(heading(headingMatch[1].length, headingMatch[2]));
      continue;
    }

    const bulletMatch = /^[-*]\s+(.*)$/.exec(line);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'bulletList') {
        flushList();
        currentList = { type: 'bulletList', items: [] };
      }
      currentList.items.push(listItem(bulletMatch[1]));
      continue;
    }

    const orderedMatch = /^\d+\.\s+(.*)$/.exec(line);
    if (orderedMatch) {
      if (!currentList || currentList.type !== 'orderedList') {
        flushList();
        currentList = { type: 'orderedList', items: [] };
      }
      currentList.items.push(listItem(orderedMatch[1]));
      continue;
    }

    flushList();
    content.push(paragraph(line));
  }

  flushList();

  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] };
}

/** Plain text becomes one paragraph per blank-line-separated block, no markdown parsing. */
function plainTextToTiptap(text) {
  const blocks = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const content = blocks.map((block) => ({
    type: 'paragraph',
    content: [{ type: 'text', text: block.replace(/\n/g, ' ') }],
  }));

  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] };
}

async function importFile({ ownerId, originalName, buffer }) {
  const ext = path.extname(originalName).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw ApiError.badRequest(
      `Unsupported file type "${ext || 'unknown'}". Only .txt and .md files can be imported.`
    );
  }

  const text = buffer.toString('utf-8').trim();
  if (!text) {
    throw ApiError.badRequest('The uploaded file is empty');
  }

  const content = ext === '.md' ? markdownToTiptap(text) : plainTextToTiptap(text);
  const title = path.basename(originalName, ext) || 'Imported document';

  return documentService.importDocument({ ownerId, title, content });
}

module.exports = { importFile, markdownToTiptap, plainTextToTiptap, SUPPORTED_EXTENSIONS };
