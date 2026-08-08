import { ZodError } from 'zod';

/**
 * Higher-order middleware function that validates request body, query, or params with a Zod schema.
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed; // Replace with sanitized, type-safe parsed data
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorIssues = err.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return res.status(400).json({
          success: false,
          error: 'Input validation failed. Please check your submission.',
          details: errorIssues,
          code: 'VALIDATION_ERROR',
        });
      }
      next(err);
    }
  };
}
