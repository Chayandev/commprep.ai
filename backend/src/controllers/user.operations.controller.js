import { ListeningAssessment } from "../models/listeningAssessment.model.js";
import { ReadingAssessment } from "../models/readingAssessments.model.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { asyncHandelr } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
/*
 *
 *adding readingassements
 *
 *
 */

const addReadingAssessment = asyncHandelr(async (req, res) => {
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
 *get all reading assesments
 *
 *
 */

const getReadingAssessments = asyncHandelr(async (req, res) => {
  const userId = req.user._id;

  const assessments = await ReadingAssessment.aggregate([
    {
      $addFields: {
        userCompletion: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$assessmentCompleters",
                as: "completer",
                cond: { $eq: ["$$completer.userId", userId] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        passage: 1,
        difficulty: 1,
        evaluationCriteria: 1,
        isCompleted: {
          $cond: {
            if: { $gt: [{ $type: "$userCompletion" }, "missing"] },
            then: true,
            else: false,
          },
        },
        score: { $ifNull: ["$userCompletion.score", null] },
        completedAt: { $ifNull: ["$userCompletion.completedAt", null] },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        assessments,
        "Reading assessments fetched successfully"
      )
    );
});

//******************************************************************************************* */

/*
 *
 *adding all listening assessments
 *
 *
 */

const addListeningAssessment = asyncHandelr(async (req, res) => {
  const { difficulty, mcqQuestions, saqQuestions, evaluationCriteria } =
    req.body;
  console.log(difficulty);
  console.log(mcqQuestions);
  console.log(saqQuestions);
  console.log(evaluationCriteria);

  // Input validation (basic checks)
  if (!difficulty || !evaluationCriteria || !mcqQuestions || !saqQuestions) {
    return res.status(400).json({
      message: "Invalid input data",
    });
  }

  // Parse JSON strings into objects for nested fields
  const parsedMcqQuestions = JSON.parse(mcqQuestions);
  const parsedSaqQuestions = JSON.parse(saqQuestions);
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
    difficulty,
    mcqQuestions: parsedMcqQuestions.map((mcq) => ({
      question: mcq.question,
      options: mcq.options,
      correctOption: mcq.correctOption,
    })),
    saqQuestions: parsedSaqQuestions.map((saq) => ({
      question: saq.question,
      expectedAnswer: saq.expectedAnswer,
    })),
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
 *get allt her listening assessments
 *
 *
 */

const getListeningAssessments = asyncHandelr(async (req, res) => {
  const userId = req.user._id;

  const assessments = await ListeningAssessment.aggregate([
    {
      $addFields: {
        userCompletion: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$assessmentCompleters",
                as: "completer",
                cond: { $eq: ["$$completer.userId", userId] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        passage: 1,
        difficulty: 1,
        evaluationCriteria: 1,
        mcqQuestions: 1,
        saqQuestions: 1,
        isCompleted: {
          $cond: {
            if: { $gt: [{ $type: "$userCompletion" }, "missing"] },
            then: true,
            else: false,
          },
        },
        score: { $ifNull: ["$userCompletion.score", null] },
        completedAt: { $ifNull: ["$userCompletion.completedAt", null] },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        assessments,
        "Listening assessments fetched successfully"
      )
    );
});
//********************************************************** */

export {
  addReadingAssessment,
  getReadingAssessments,
  addListeningAssessment,
  getListeningAssessments,
};
