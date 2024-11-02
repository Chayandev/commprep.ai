import { Router } from "express";
import {
  registerUser,
  getAvatars,
  verifyEmail,
  loginUser,
  logoutUser,
  refreshAccessToken,
  autoLoginUser,
  sendVerificationCode,
  resetPassword,
} from "../controllers/user.auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addReadingAssesment,
  getReadingAssesments,
} from "../controllers/user.operations.controller.js";
import { analyzeReadingAssessment } from "../controllers/assesment.analysis.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//normal-routes-for-auth
router.route("/avatars").get(getAvatars);
router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/autoLogin").post(autoLoginUser);
router.route("/sendVerificationCode").post(sendVerificationCode);
router.route("/resetPassword").post(resetPassword);

//routes for setup the assesments
router.route("/addReadingAssesment").post(addReadingAssesment);

//testing
// router.route("/getOpenAIModels").get(getOpenAIModels);
router
  .route("/analyzeReadingAssesment")
  .post(
    verifyJWT,
    upload.fields([{ name: "audio", maxCount: 1 }]),
    analyzeReadingAssessment
  );
//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/getReadingAssesments").get(verifyJWT, getReadingAssesments);
export default router;
