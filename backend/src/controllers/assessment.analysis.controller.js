import {
  asyncHandler,
  ApiError,
  ApiResponse,
} from "../utils/apiHandler/exports.js";
import fs from "fs"; // Import the fs module to handle file operations
import { AssemblyAI } from "assemblyai";
import {
  ReadingAssessment,
  ListeningAssessment,
  User,
  GrammarAssessment,
  VocabularyAssessment,
  SpeakingAssessment,
} from "../models/exports.js";
import {
  getAudioDuration,
  analyzeAgainstPassageAndGenerateFeedback,
  calculateScore,
  getTranscriptionAnalysis,
  generateFeedbackAndSuggestions,
} from "../utils/assessmentAnalysisHelper/exports.js";

// Initialize the AssemblyAI client with the API key
const assemblyClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

/**
 * Analyze a reading assessment by transcribing an audio file and
 * comparing it to a given passage, updating the user's progress and
 * assessment data based on the transcription results.
 */
const analyzeReadingAssessment = asyncHandler(async (req, res) => {
  const { passage, assessmentID } = req.body;

  // Validate required data
  if (!passage) {
    throw new ApiError(400, "Passage is required to analyze the audio");
  }

  // Validate and retrieve audio file path
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

  // Attempt transcription of the audio file
  const transcript = await assemblyClient.transcripts.transcribe({
    audio: audioLocalPath,
  });

  console.log(transcript);
  // Validate transcription response
  if (!transcript) {
    throw new ApiError(500, "Transcription failed or returned invalid data");
  }

  // Analyze transcription against the provided passage
  const response = await analyzeAgainstPassageAndGenerateFeedback(
    transcript,
    passage
  );

  // Remove the audio file after processing
  fs.unlinkSync(audioLocalPath);

  // Update reading assessment record with user completion data
  await updateAssessmentCompletion(
    ReadingAssessment,
    assessmentID,
    req.user._id,
    response.overallScore
  );

  // Update the user's progress for reading assessments
  await updateUserProgress(
    User,
    req.user._id,
    assessmentID,
    response.overallScore,
    "reading"
  );

  // Return the transcription analysis result
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Successfully transcribed"));
});
//*************************************************************************************/

/**
 *
 * Analyzes listening assessment responses and updates the user's progress.
 *
 */
const analyzeListeningAssessment = asyncHandler(async (req, res) => {
  const { answers, assessmentID } = req.body;

  if (!answers || !assessmentID)
    throw new ApiError(400, "Incomplete request data");

  // Calculate score and feedback for listening assessment
  const { score, totalQuestions } = await calculateScore(
    ListeningAssessment,
    answers,
    assessmentID
  );
  const { feedback, suggestions } = await generateFeedbackAndSuggestions(
    score,
    totalQuestions
  );
  // Update listening assessment completion record
  await updateAssessmentCompletion(
    ListeningAssessment,
    assessmentID,
    req.user._id,
    score
  );

  // Update user's progress in listening assessments
  await updateUserProgress(
    User,
    req.user._id,
    assessmentID,
    score,
    "listening"
  );

  const response = { score, feedback, suggestions };

  // Return the analysis result
  return res
    .status(201)
    .json(new ApiResponse(200, response, "Successfully Analyzed"));
});

//*************************************************************************************/

/**
 *
 * Analyzes grammar assessment responses and updates the user's progress.
 *
 */
const analyzeGrammarAssessment = asyncHandler(async (req, res) => {
  const { answers, assessmentID } = req.body;

  if (!answers || !assessmentID)
    throw new ApiError(400, "Incomplete request data");

  const { score, assessment } = await calculateScore(
    GrammarAssessment,
    answers,
    assessmentID
  );

  // Update grammar assessment completion record
  await updateAssessmentCompletion(
    GrammarAssessment,
    assessmentID,
    req.user._id,
    score
  );

  // Update user's progress in grammar assessments
  await updateUserProgress(User, req.user._id, assessmentID, score, "grammar");

  const response = { score, assessment };

  // Return the analysis result
  return res
    .status(201)
    .json(new ApiResponse(200, response, "Successfully Analyzed"));
});
//*************************************************************************************/

/**
 *
 * Analyzes vocabulary assessment responses and updates the user's progress.
 *
 */
const analyzeVocabularyAssessment = asyncHandler(async (req, res) => {
  const { answers, assessmentID } = req.body;

  if (!answers || !assessmentID)
    throw new ApiError(400, "Incomplete request data");

  const { score, assessment } = await calculateScore(
    VocabularyAssessment,
    answers,
    assessmentID
  );

  // Update vocabulary assessment completion record
  await updateAssessmentCompletion(
    VocabularyAssessment,
    assessmentID,
    req.user._id,
    score
  );

  // Update user's vocabulary in grammar assessments
  await updateUserProgress(
    User,
    req.user._id,
    assessmentID,
    score,
    "vocabulary"
  );

  const response = { score, assessment };

  // Return the analysis result
  return res
    .status(201)
    .json(new ApiResponse(200, response, "Successfully Analyzed"));
});

/************************************************************************************************* */
/**
 *
 * Analyzes speaking assessment responses and updates the user's progress.
 *
 */
const analyzeSpeakingAssessment = asyncHandler(async (req, res) => {
  const { topic, assessmentID } = req.body;

  if (!topic) {
    throw new ApiError(400, "Topic is required to analyze");
  }
  // Validate and retrieve audio file path
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

  // Get the duration of the audio file
  let audioDuration;
  try {
    audioDuration = await getAudioDuration(audioLocalPath);
    console.log(`Audio Duration: ${audioDuration} seconds`);
  } catch (error) {
    console.error("Error fetching audio duration:", error);
    throw new ApiError(500, "Failed to retrieve audio duration");
  }

  // Attempt transcription of the audio file
  const transcript = await assemblyClient.transcripts.transcribe({
    audio: audioLocalPath,
  });

  console.log(transcript);
  // Validate transcription response
  if (!transcript) {
    throw new ApiError(500, "Transcription failed or returned invalid data");
  }

  // Analyze transcription with audio duration
  const { grammarScore, relevanceScore, adequacyScore, feedback, suggestions } =
    await getTranscriptionAnalysis(transcript, topic, audioDuration);

  //calculate overallscore by calcualting avarage
  const score = (grammarScore + relevanceScore + adequacyScore) / 3;

  // Update speaking assessment completion record
  await updateAssessmentCompletion(
    SpeakingAssessment,
    assessmentID,
    req.user._id,
    score
  );

  // Update user's Porogress in speaking assessments
  await updateUserProgress(User, req.user._id, assessmentID, score, "speaking");

  // Remove the audio file after processing
  fs.unlinkSync(audioLocalPath);

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        overallScore: score,
        grammarScore: grammarScore,
        relevanceScore: relevanceScore,
        adequacyScore: adequacyScore,
        feedback: feedback,
        suggestions: suggestions,
      },
      "Successfully Analyzed!"
    )
  );
});

/******************************************************************************************* */

/**
 * Update the assessment completion status for a user.
 */
async function updateAssessmentCompletion(model, assessmentID, userID, score) {
  // Check if the assessment completer with the given userId already exists
  const existingEntry = await model.findOne({
    _id: assessmentID,
    "assessmentCompleters.userId": userID,
  });

  if (existingEntry) {
    // If the user already exists, update their score and completedAt fields
    await model.updateOne(
      { _id: assessmentID, "assessmentCompleters.userId": userID },
      {
        $set: {
          "assessmentCompleters.$.score": score,
          "assessmentCompleters.$.completedAt": new Date(),
        },
      }
    );
  } else {
    // If the user doesn't exist in assessmentCompleters, add them
    await model.findByIdAndUpdate(
      assessmentID,
      {
        $addToSet: {
          assessmentCompleters: {
            userId: userID,
            score,
            completedAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }
}
//*************************************************************************************/

/**
 * Update user progress for completed assessments.
 */
async function updateUserProgress(
  userModel,
  userID,
  assessmentID,
  score,
  type
) {
  const user = await userModel.findById(userID);

  // Access the specific progress field based on the 'type' argument
  const progressType = user.progress[type];

  if (!progressType) {
    throw new Error(`Invalid progress type: ${type}`);
  }

  // Find the index of the existing assessment, if any
  const existingAssessmentIndex = progressType.assessments.findIndex(
    (assessment) => assessment.assessmentId.toString() === assessmentID
  );

  if (existingAssessmentIndex === -1) {
    // Add new assessment if it doesn't exist
    progressType.assessments.push({
      assessmentId: assessmentID,
      takenAt: new Date(),
      evaluationResult: { overallScore: score },
    });
  } else {
    // Update the existing assessment
    progressType.assessments[existingAssessmentIndex] = {
      assessmentId: assessmentID,
      takenAt: new Date(),
      evaluationResult: { overallScore: score },
    };
  }

  // Get the total number of assessments for the given type
  // const AssessmentModel =
  //   type === "reading"
  //     ? ReadingAssessment
  //     : type === "listening"
  //     ? ListeningAssessment
  //     : type === "grammar"
  //     ? GrammarAssessment
  //     : VocabularyAssessment;

  //const totalAvailableAssessments = await AssessmentModel.countDocuments();

  // Calculate the completion percentage
  // const completedAssessments = progressType.assessments.length;
  // progressType.completionPercentage =
  //   Math.floor((completedAssessments / totalAvailableAssessments) * 100) || 0;

  await user.save();
}

export {
  analyzeReadingAssessment,
  analyzeListeningAssessment,
  analyzeGrammarAssessment,
  analyzeVocabularyAssessment,
  analyzeSpeakingAssessment,
};
