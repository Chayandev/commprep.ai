import {
  addGrammarAssessment,
  addListeningAssessment,
  addReadingAssessment,
  addSpeakingAssessment,
  addVocabularyAssessment,
} from "../controllers/operation/admin.operations.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import { Router } from "express";

const router = Router();

//routes for setup the assesments
router.route("/addReadingAssessment").post(addReadingAssessment);
router
  .route("/addListeningAssessment")
  .post(
    upload.fields([{ name: "audio", maxCount: 1 }]),
    addListeningAssessment
  );
router.route("/addGrammarAssessment").post(addGrammarAssessment);
router.route("/addVocabularyAssessment").post(addVocabularyAssessment);
router.route("/addSpeakingAssessment").post(addSpeakingAssessment);

export default router;