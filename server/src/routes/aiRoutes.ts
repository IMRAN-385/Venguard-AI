import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { uploadSingle } from "../middleware/upload";

// ============================================================
// /api/ai/*
//
// Most endpoints support optionalAuth so unauthenticated demo
// use still works — but responses will be un-personalized and
// won't be persisted to the audit trail.
// ============================================================

const router = Router();

// -------- Agent 03 — Copilot --------
router.post("/copilot", optionalAuth, aiController.copilot);

// -------- Agent 01 — Memo generator --------
router.post("/generate-memo", optionalAuth, aiController.generateMemo);

// -------- Agent 05 — Auto-classifier --------
router.post("/classify", optionalAuth, aiController.classify);

// -------- Agent 04 — Data analyzer (file upload) --------
router.post("/analyze", optionalAuth, uploadSingle, aiController.analyze);

// -------- Agent 02 — Smart matching --------
router.post("/recommend", optionalAuth, aiController.recommend);

// -------- Agent 06 — Multi-LLM settings (per-user) --------
router.get ("/settings", requireAuth, aiController.getSettings);
router.post("/settings", requireAuth, aiController.saveSettings);

export default router;