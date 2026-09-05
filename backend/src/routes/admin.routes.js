import {
  addGrammarAssessment,
  addListeningAssessment,
  addReadingAssessment,
  addSpeakingAssessment,
  addVocabularyAssessment,
} from "../controllers/operation/admin.operations.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import { Router } from "express";
import { verifyAdminRole, verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//routes for setup the assesments
router.route("/addReadingAssessment").post(verifyJWT,verifyAdminRole,addReadingAssessment);
router
  .route("/addListeningAssessment")
  .post(
    verifyJWT,
    verifyAdminRole,
    upload.fields([{ name: "audio", maxCount: 1 }]),
    addListeningAssessment
  );
router.route("/addGrammarAssessment").post(verifyJWT,verifyAdminRole,addGrammarAssessment);
router.route("/addVocabularyAssessment").post(verifyJWT,verifyAdminRole,addVocabularyAssessment);
router.route("/addSpeakingAssessment").post(verifyJWT,verifyAdminRole,addSpeakingAssessment);

export default router;