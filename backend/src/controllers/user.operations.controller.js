import { UserFeedback } from "../models/feedback.model.js";
import { GrammarAssessment } from "../models/grammarAssessment.model.js";
import { ListeningAssessment } from "../models/listeningAssessment.model.js";
import { ReadingAssessment } from "../models/readingAssessments.model.js";
import { SpeakingAssessment } from "../models/speakingAssessments.model.js";
import { VocabularyAssessment } from "../models/vocabularyAssessment.model.js";
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
        audioFileUrl: 1,
        passage: 1,
        difficulty: 1,
        evaluationCriteria: 1,
        title: 1,
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

/*
 *
 * adding all grammar assessments
 *
 *
 */

const addGrammarAssessment = asyncHandelr(async (req, res) => {
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

//**************************************************** */
/*
 *
 *get all thhe grammar assessments
 *
 *
 */
const getGrammarAssessments = asyncHandelr(async (req, res) => {
  const userId = req.user._id;

  const assessments = await GrammarAssessment.aggregate([
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
        difficulty: 1,
        evaluationCriteria: 1,
        mcqQuestions: {
          question: 1,
          options: 1,
        },
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
        "Grammar assessments fetched successfully"
      )
    );
});

//***************************************************************** */

/*
 *
 * adding all vocabulary assessments
 *
 *
 */
const addVocabularyAssessment = asyncHandelr(async (req, res) => {
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
 *get all thhe vocabulary assessments
 *
 *
 */
const getVocabularyAssessments = asyncHandelr(async (req, res) => {
  const userId = req.user._id;

  const assessments = await VocabularyAssessment.aggregate([
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
        difficulty: 1,
        evaluationCriteria: 1,
        mcqQuestions: {
          question: 1,
          options: 1,
        },
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
        "Vocabulary assessments fetched successfully"
      )
    );
});

//**************************************************** */
/*
 *
 * add speaking assessments
 *
 *
 */
const addSpeakingAssessment = asyncHandelr(async (req, res) => {
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
/*
 *
 * get speaking assessments
 *
 *
 */

const getSpeakingAssessments = asyncHandelr(async (req, res) => {
  const userId = req.user._id;
  const assessments = await SpeakingAssessment.aggregate([
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
        // Add the new field timeToComplete which is the sum of timeToSpeak and timeToThink
        timeToComplete: {
          $add: [
            "$evaluationCriteria.timeToSpeak",
            "$evaluationCriteria.timeToThink",
          ],
        },
      },
    },
    {
      $project: {
        topic: 1,
        difficulty: 1,
        evaluationCriteria: 1,
        timeToComplete: 1, // Include the new field in the final output
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
        "Speaking assessments fetched successfully"
      )
    );
});

/*
 *
 * collect feedback and store
 *
 *
 */

const addUserFeedback = asyncHandelr(async (req, res) => {
  const { title, feedbackDescription, feedbackType, rating } = req.body;
  // Validate the required fields
  if (!title || !feedbackDescription || !feedbackType) {
    return res.status(400).json(new ApiError(400, "All fields are required."));
  }
  // Check if the user already has feedback stored
  const existingUserFeedback = await UserFeedback.findOne({
    userId: req.user._id,
  });

  if (existingUserFeedback) {
    // If feedbacks exist, push the new feedback into the array
    existingUserFeedback.feedbacks.push(
      title,
      feedbackDescription,
      feedbackType,
      rating
    );
    await existingUserFeedback.save();
  } else {
    // If no feedback exists, create a new record for the user
    const newFeedback = new UserFeedback({
      userId: req.user._id,
      feedbacks: [
        {
          title,
          feedbackDescription,
          feedbackType,
          rating,
        },
      ],
    });
    await newFeedback.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(200, null, "Successfully added feedback"));
});

const getEachTotalAssessmentCount = asyncHandelr(async (req, res) => {
  const totalReadingAssessments = await ReadingAssessment.countDocuments();
  const totalListeningAssessments = await ListeningAssessment.countDocuments();
  const totalGrammarAssessments = await GrammarAssessment.countDocuments();
  const totalVocabularyAssessments =
    await VocabularyAssessment.countDocuments();
  const totalSpeakingAssessments = await SpeakingAssessment.countDocuments();
  return res.status(201).json(
    new ApiResponse(
      200,
      {
        totalReadingAssessments,
        totalListeningAssessments,
        totalGrammarAssessments,
        totalVocabularyAssessments,
        totalSpeakingAssessments,
      },
      "Sucessfully get the total assessments count"
    )
  );
  // Calculate the completion percentage
  // const completedAssessments = progressType.assessments.length;
  // progressType.completionPercentage =
  //   Math.floor((completedAssessments / totalAvailableAssessments) * 100) || 0;
});
export {
  addReadingAssessment,
  getReadingAssessments,
  addListeningAssessment,
  getListeningAssessments,
  addGrammarAssessment,
  getGrammarAssessments,
  addVocabularyAssessment,
  getVocabularyAssessments,
  addSpeakingAssessment,
  getSpeakingAssessments,
  addUserFeedback,
  getEachTotalAssessmentCount,
};
