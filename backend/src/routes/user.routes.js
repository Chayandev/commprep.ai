
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
} from "../controllers/auth/user.auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addUserFeedback,
  getEachTotalAssessmentCount,
  getGrammarAssessments,
  getListeningAssessments,
  getReadingAssessments,
  getSpeakingAssessments,
  getVocabularyAssessments,
} from "../controllers/operation/user.operations.controller.js";
import {
  analyzeGrammarAssessment,
  analyzeListeningAssessment,
  analyzeReadingAssessment,
  analyzeSpeakingAssessment,
  analyzeVocabularyAssessment,
} from "../controllers/analysis/assessment.analysis.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import { Router } from "express";

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


//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/getReadingAssessments").get(verifyJWT, getReadingAssessments);
router
  .route("/analyzeReadingAssessment")
  .post(
    verifyJWT,
    upload.fields([{ name: "audio", maxCount: 1 }]),
    analyzeReadingAssessment
  );
router
  .route("/getListeningAssessments")
  .get(verifyJWT, getListeningAssessments);
router
  .route("/analyzeListeningAssessment")
  .post(verifyJWT, analyzeListeningAssessment);

router.route("/getGrammarAssessments").get(verifyJWT, getGrammarAssessments);
router
  .route("/analyzeGrammarAssessment")
  .post(verifyJWT, analyzeGrammarAssessment);
router
  .route("/getVocabularyAssessments")
  .get(verifyJWT, getVocabularyAssessments);

router
  .route("/analyzeVocabularyAssessment")
  .post(verifyJWT, analyzeVocabularyAssessment);

router
  .route("/analyzeSpeakingAssessment")
  .post(
    verifyJWT,
    upload.fields([{ name: "audio", maxCount: 1 }]),
    analyzeSpeakingAssessment
  );

router.route("/getSpeakingAssessments").get(verifyJWT, getSpeakingAssessments);

router.route("/addUserFeedback").post(verifyJWT, addUserFeedback);
router
  .route("/getEachAssessmentCount")
  .get(verifyJWT, getEachTotalAssessmentCount);

  export default router;