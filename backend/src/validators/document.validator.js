const { z } = require('zod');

const createDocumentSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
});

const renameDocumentSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(200),
});

// TipTap JSON is a nested, variable-shape tree — validate loosely (must be a
// plain object with a "type" field) rather than over-specifying every node.
const updateContentSchema = z.object({
  content: z
    .object({ type: z.string() })
    .passthrough(),
});

module.exports = { createDocumentSchema, renameDocumentSchema, updateContentSchema };
