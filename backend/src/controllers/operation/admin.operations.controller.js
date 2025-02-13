import {
    ReadingAssessment,
    ListeningAssessment,
    GrammarAssessment,
    VocabularyAssessment,
    SpeakingAssessment,
  } from "../../models/exports.js";
  import {
    asyncHandler,
    ApiError,
    ApiResponse,
  } from "../../utils/apiHandler/exports.js";
  import { uploadOnCloudinary } from "../../utils/cloudinary.js";
/*
 *
 *adding readingassements
 *
 *
 */


const addReadingAssessment = asyncHandler(async (req, res) => {
  const { passage, difficulty, timeToComplete } = req.body;

  // Directly create and save the new assessment document
  const newAssessment = await ReadingAssessment.create({
    passage,
    difficulty,
    evaluationCriteria: {
      timeToComplete,
    },
  });
  console.log(newAssessment);

  return res
    .status(201)
    .json(
      new ApiResponse(200, null, "Reading assessment created successfully")
    );
});
//************************************************************ */

/*
 *
 *adding all listening assessments
 *
 *
 */

const addListeningAssessment = asyncHandler(async (req, res) => {
  const { title, difficulty, mcqQuestions, saqQuestions, evaluationCriteria } =
    req.body;
  // console.log(difficulty);
  // console.log(mcqQuestions);
  // console.log(saqQuestions);
  // console.log(evaluationCriteria);

  // Input validation (basic checks)
  if (!title || !difficulty || !evaluationCriteria || !mcqQuestions) {
    return res.status(400).json({
      message: "Invalid input data",
    });
  }

  // Parse JSON strings into objects for nested fields
  const parsedMcqQuestions = JSON.parse(mcqQuestions);
  //const parsedSaqQuestions = JSON.parse(saqQuestions);
  const parsedEvaluationCriteria = JSON.parse(evaluationCriteria);

  let audioLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.audio) &&
    req.files.audio.length > 0
  ) {
    audioLocalPath = req.files.audio[0].path;
  }

  if (!audioLocalPath) {
    throw new ApiError(400, "Audio file is required");
  }

  const audioFileUrl = await uploadOnCloudinary(audioLocalPath);

  if (!audioFileUrl) {
    throw new ApiError(400, "Audio file is missing");
  }

  console.log("audioFileUrl", audioFileUrl);
  const newAssessment = await ListeningAssessment.create({
    audioFileUrl: audioFileUrl.url,
    title: title,
    difficulty,
    mcqQuestions: parsedMcqQuestions.map((mcq) => ({
      question: mcq.question,
      options: mcq.options,
      correctOption: mcq.correctOption,
    })),
    // saqQuestions: parsedSaqQuestions.map((saq) => ({
    //   question: saq.question,
    //   expectedAnswer: saq.expectedAnswer,
    // })),
    evaluationCriteria: parsedEvaluationCriteria,
  });

  console.log(newAssessment);

  return res
    .status(201)
    .json(
      new ApiResponse(200, null, "Listening assessment created successfully")
    );
});

//***************************************************************** */

/*
 *
 * adding all grammar assessments
 *
 *
 */

const addGrammarAssessment = asyncHandler(async (req, res) => {
  const { difficulty, evaluationCriteria, mcqQuestions } = req.body;

  console.log("Received Difficulty:", difficulty);
  console.log("Received MCQ Questions:", mcqQuestions);
  console.log("Received Evaluation Criteria:", evaluationCriteria);

  // Check if the required fields are present
  if (!difficulty || !evaluationCriteria || !mcqQuestions) {
    return res.status(400).json({
      message: "Invalid input data",
    });
  }

  const newAssessment = await GrammarAssessment.create({
    difficulty,
    mcqQuestions: mcqQuestions.map((mcq) => ({
      question: mcq.question,
      options: mcq.options,
      correctOption: mcq.correctOption,
    })),
    evaluationCriteria,
  });

  console.log("New Assessment Created:", newAssessment);

  return res
    .status(201)
    .json(
      new ApiResponse(200, null, "Grammar assessment created successfully")
    );
});

/******************************************************************************** */
/*
 *
 * adding all vocabulary assessments
 *
 *
 */
const addVocabularyAssessment = asyncHandler(async (req, res) => {
  const { difficulty, evaluationCriteria, mcqQuestions } = req.body;

  console.log("Received Difficulty:", difficulty);
  console.log("Received MCQ Questions:", mcqQuestions);
  console.log("Received Evaluation Criteria:", evaluationCriteria);

  // Check if the required fields are present
  if (!difficulty || !evaluationCriteria || !mcqQuestions) {
    return res.status(400).json(new ApiError(400, "Invalid Input format"));
  }

  const newAssessment = await VocabularyAssessment.create({
    difficulty,
    mcqQuestions: mcqQuestions.map((mcq) => ({
      question: mcq.question,
      options: mcq.options,
      correctOption: mcq.correctOption,
    })),
    evaluationCriteria,
  });

  console.log("New Assessment Created:", newAssessment);

  return res
    .status(201)
    .json(
      new ApiResponse(200, null, "Vocabulary assessment created successfully")
    );
});
//**************************************************** */

/*
 *
 * add speaking assessments
 *
 *
 */
const addSpeakingAssessment = asyncHandler(async (req, res) => {
  const { topic, difficulty, evaluationCriteria } = req.body;

  if (!topic || !difficulty || !evaluationCriteria) {
    return res.status(400).json(new ApiError(400, "Invalid Input format"));
  }
  const newAssessment = await SpeakingAssessment.create({
    topic: topic,
    difficulty: difficulty,
    evaluationCriteria: evaluationCriteria,
  });

  console.log("New Assessment Created:", newAssessment);

  return res
    .status(201)
    .json(
      new ApiResponse(200, null, "Speaking assessment created successfully")
    );
});

//**************************************************** */

export {
  addReadingAssessment,
  addGrammarAssessment,
  addListeningAssessment,
  addSpeakingAssessment,
  addVocabularyAssessment,
};
