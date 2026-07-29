import { Router } from "express";
import * as authController from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
} from "../validators/authValidators";

const router = Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  authController.register
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  authController.login
);

router.post(
  "/demo-login",
  authController.demoLogin
);

router.post(
  "/google-login",
  validate({ body: googleLoginSchema }),
  authController.googleLogin
);

router.get(
  "/me",
  requireAuth,
  authController.me
);

router.post(
  "/logout",
  authController.logout
);

export default router;