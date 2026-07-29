import { Router } from "express";
import * as assetsController from "../controllers/assetsController";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createAssetSchema,
  updateAssetSchema,
  listAssetsQuerySchema,
  idParamSchema,
} from "../validators/assetsValidators";

const router = Router();

router.get(
  "/",
  optionalAuth,
  validate({ query: listAssetsQuerySchema }),
  assetsController.list
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  assetsController.get
);

router.post(
  "/",
  requireAuth,
  validate({ body: createAssetSchema }),
  assetsController.create
);

router.patch(
  "/:id",
  requireAuth,
  validate({ params: idParamSchema, body: updateAssetSchema }),
  assetsController.update
);

router.delete(
  "/:id",
  requireAuth,
  validate({ params: idParamSchema }),
  assetsController.remove
);

export default router;