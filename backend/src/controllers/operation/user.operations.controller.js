import {
  ReadingAssessment,
  ListeningAssessment,
  UserFeedback,
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
 *get all reading assesments
 *
 *
 */

const getReadingAssessments = asyncHandler(async (req, res) => {
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
 *get allt her listening assessments
 *
 *
 */

const getListeningAssessments = asyncHandler(async (req, res) => {
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
 *get all thhe grammar assessments
 *
 *
 */
const getGrammarAssessments = asyncHandler(async (req, res) => {
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
 *get all thhe vocabulary assessments
 *
 *
 */
const getVocabularyAssessments = asyncHandler(async (req, res) => {
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
 * get speaking assessments
 *
 *
 */

const getSpeakingAssessments = asyncHandler(async (req, res) => {
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

const addUserFeedback = asyncHandler(async (req, res) => {
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

const getEachTotalAssessmentCount = asyncHandler(async (req, res) => {
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
  getReadingAssessments,
  getListeningAssessments,
  getGrammarAssessments,
  addVocabularyAssessment,
  getVocabularyAssessments,
  getSpeakingAssessments,
  addUserFeedback,
  getEachTotalAssessmentCount,
};
