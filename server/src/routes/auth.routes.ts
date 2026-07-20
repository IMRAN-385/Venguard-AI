import { Router } from "express";
import { register, login, demoLogin, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/demo-login", demoLogin);
router.get("/me", protect, getMe);

export default router;