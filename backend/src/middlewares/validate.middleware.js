const ApiError = require('../utils/ApiError');

/**
 * Validates req.body against a zod schema and replaces req.body with the
 * parsed (and coerced) result so downstream code trusts its shape.
 */
function validate(schema) {
  return function validateMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed', details));
    }
    req.body = result.data;
    return next();
  };
}

module.exports = validate;
