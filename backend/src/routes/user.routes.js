import { Router } from "express";
import {
  registerUser,
  getAvatars,
  verifyEmail,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//normal-routes
router.route("/avatars").get(getAvatars);
router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/refreshAccessToken").post(refreshAccessToken);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
