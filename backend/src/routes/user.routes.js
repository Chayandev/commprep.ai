import { Router } from "express";
import { registerUser, getAvatars } from "../controllers/user.controller.js";

const router = Router();

router.route("/avatars").get(getAvatars);
router.route("/register").post(registerUser);
export default router;
