import { Router } from "express";
import {
  registerUser,
  getAvatars,
  verifyEmail,
  loginUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/avatars").get(getAvatars);
router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(loginUser);
export default router;
