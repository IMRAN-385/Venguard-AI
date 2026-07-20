import { Router } from "express";
import multer from "multer";
import {
  generateMemo,
  copilotChat,
  analyzeData,
  getRecommendations,
  saveMemo,
} from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.post("/generator", protect, generateMemo);
router.post("/memo", protect, saveMemo);
router.post("/copilot", protect, copilotChat);
router.post("/analyzer", protect, upload.single("file"), analyzeData);
router.get("/recommendations", protect, getRecommendations);

export default router;