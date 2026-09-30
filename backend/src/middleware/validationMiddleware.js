import { sendError } from '../utils/responseHelper.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed data back
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;

      next();
    } catch (err) {
      if (err.errors) {
        const validationErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return sendError(res, 'Validation failed for request parameters.', 400, validationErrors);
      }
      next(err);
    }
  };
};
