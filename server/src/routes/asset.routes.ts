import { Router } from "express";
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getMyAssets,
} from "../controllers/asset.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAssets);
router.get("/mine", protect, getMyAssets);
router.get("/:id", getAssetById);
router.post("/", protect, createAsset);
router.put("/:id", protect, updateAsset);
router.delete("/:id", protect, deleteAsset);

export default router;