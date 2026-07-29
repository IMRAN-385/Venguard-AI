import { Router } from "express";
import { z } from "zod";
import * as reviewsController from "../controllers/reviewsController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createReviewSchema,
  idParamSchema,
} from "../validators/assetsValidators";

// ============================================================
// /api/assets/:id/reviews
//
// Mounted at /api/assets in index.ts, so paths here are
// relative to that base and re-declare :id via mergeParams.
// ============================================================

const router = Router({ mergeParams: true });

// Additional param schema for the composite route with :reviewId
const reviewIdParamSchema = z.object({
  id:       z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid asset id."),
  reviewId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid review id."),
});

// -------- List reviews (public) --------
router.get(
  "/:id/reviews",
  validate({ params: idParamSchema }),
  reviewsController.list
);

// -------- Create review (auth) --------
router.post(
  "/:id/reviews",
  requireAuth,
  validate({ params: idParamSchema, body: createReviewSchema }),
  reviewsController.create
);

// -------- Delete review (auth) --------
router.delete(
  "/:id/reviews/:reviewId",
  requireAuth,
  validate({ params: reviewIdParamSchema }),
  reviewsController.remove
);

export default router;