import { Router } from "express";
import { getAvatars } from "../controllers/user.controller.js";

const router = Router();

router.route("/avatars").get(getAvatars);

export default router;
