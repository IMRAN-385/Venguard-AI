import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

// ============================================================
// Zod request validation middleware
//
// Usage:
//   router.post("/login",
//     validate({ body: loginSchema }),
//     authController.login);
// ============================================================

interface ValidateSchemas {
  body?:   ZodSchema;
  query?:  ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidateSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body)   req.body   = schemas.body.parse(req.body);
      if (schemas.query)  {
        const parsed = schemas.query.parse(req.query);
        // Reassign fields onto req.query (which is readonly in newer Express)
        Object.assign(req.query, parsed);
      }
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      next();
    } catch (err) {
      next(err); // let errorHandler format ZodError
    }
  };
}