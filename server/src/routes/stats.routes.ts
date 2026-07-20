import { Router } from "express";
import { getPortfolioStats, getMarketStats } from "../controllers/stats.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/portfolio", protect, getPortfolioStats);
router.get("/market", getMarketStats);

export default router;