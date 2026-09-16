const { z } = require('zod');

const shareDocumentSchema = z.object({
  email: z.string().email('Invalid email address'),
  permission: z.enum(['view', 'edit'], {
    errorMap: () => ({ message: 'Permission must be "view" or "edit"' }),
  }),
});

module.exports = { shareDocumentSchema };
