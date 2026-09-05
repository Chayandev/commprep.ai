import {
  asyncHandler,
  ApiError,
  ApiResponse,
} from "../../utils/apiHandler/exports.js";
import fs from "fs"; // Import the fs module to handle file operations
import { AssemblyAI } from "assemblyai";
import {
  ReadingAssessment,
  ListeningAssessment,
  GrammarAssessment,
  VocabularyAssessment,
  SpeakingAssessment,
} from "../../models/exports.js";
import {
  getAudioDuration,
  analyzeAgainstPassageAndGenerateFeedback,
  calculateScore,
  getTranscriptionAnalysis,
  generateFeedbackAndSuggestions,
} from "../../utils/assessmentAnalysisHelper/exports.js";

import { logger } from "../../utils/logger/logger.js";
import { UserProgress } from "../../models/progress.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

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

  // Upload audio to Cloudinary in dedicated reading folder
  const cloudinaryResponse = await uploadOnCloudinary(
    audioLocalPath,
    "commprep.ai_audios/reading",
    ["reading_assessment", "temp_audio", req.user?._id?.toString() || "anonymous"]
  );

  if (!cloudinaryResponse?.secure_url) {
    throw new ApiError(500, "Failed to upload audio to Cloudinary");
  }

  // Attempt transcription of the audio file using Cloudinary URL
  const transcript = await assemblyClient.transcripts.transcribe({
    audio: cloudinaryResponse.secure_url,
  });

  logger.info("Transcription result", { transcript });

  // Validate transcription response
  if (!transcript) {
    throw new ApiError(500, "Transcription failed or returned invalid data");
  }

  // Analyze transcription against the provided passage
  const response = await analyzeAgainstPassageAndGenerateFeedback(
    transcript,
    passage
  );

  logger.info("Analysis result", { response });

  // Update the user's progress for reading assessments with audio URL and public ID
  await updateUserProgress(
    req.user._id,
    assessmentID,
    response.overallScore,
    "reading",
    cloudinaryResponse.secure_url,
    cloudinaryResponse.public_id
  );

  // Return the transcription analysis result with audioUrl
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...response, audioUrl: cloudinaryResponse.secure_url },
        "Successfully transcribed"
      )
    );
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
  // Update user's progress in listening assessments
  await updateUserProgress(
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

  // Update user's progress in grammar assessments
  await updateUserProgress(req.user._id, assessmentID, score, "grammar");

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

  // Update user's vocabulary in grammar assessments
  await updateUserProgress(
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

  // Measure local duration first as fallback before file is removed by Cloudinary uploader
  let localAudioDuration = null;
  try {
    localAudioDuration = await getAudioDuration(audioLocalPath);
  } catch (error) {
    console.warn("Could not retrieve local audio duration:", error.message);
  }

  // Upload audio to Cloudinary in dedicated speaking folder
  const cloudinaryResponse = await uploadOnCloudinary(
    audioLocalPath,
    "commprep.ai_audios/speaking",
    ["speaking_assessment", "temp_audio", req.user?._id?.toString() || "anonymous"]
  );

  if (!cloudinaryResponse?.secure_url) {
    throw new ApiError(500, "Failed to upload audio to Cloudinary");
  }

  // Attempt transcription of the audio file using Cloudinary URL
  const transcript = await assemblyClient.transcripts.transcribe({
    audio: cloudinaryResponse.secure_url,
  });

  logger.info("Transcription result", { transcript });

  // Validate transcription response
  if (!transcript) {
    throw new ApiError(500, "Transcription failed or returned invalid data");
  }

  // Resolve audio duration: Cloudinary response -> local metadata -> AssemblyAI duration
  const audioDuration =
    cloudinaryResponse.duration ||
    localAudioDuration ||
    transcript.audio_duration ||
    0;

  console.log(`Audio Duration: ${audioDuration} seconds`);

  // Analyze transcription with audio duration
  const { grammarScore, relevanceScore, adequacyScore, feedback, suggestions } =
    await getTranscriptionAnalysis(transcript, topic, audioDuration);

  // Calculate overall score by calculating average
  const score = Number(
    ((grammarScore + relevanceScore + adequacyScore) / 3).toFixed(1)
  );

  // Update user's progress in speaking assessments with audio URL and public ID
  await updateUserProgress(
    req.user._id,
    assessmentID,
    score,
    "speaking",
    cloudinaryResponse.secure_url,
    cloudinaryResponse.public_id
  );

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
        audioUrl: cloudinaryResponse.secure_url,
      },
      "Successfully Analyzed!"
    )
  );
});

/******************************************************************************************* */

/**
 * Update user progress for completed assessments.
 */
async function updateUserProgress(
  userID,
  assessmentID,
  score,
  type,
  audioUrl = null,
  audioPublicId = null
) {
  const progress = await UserProgress.findOneAndUpdate(
    { userId: userID },
    {
      $setOnInsert: {
        userId: userID,
        reading: { assessments: [] },
        listening: { assessments: [] },
        grammar: { assessments: [] },
        vocabulary: { assessments: [] },
        speaking: { assessments: [] },
      },
    },
    { new: true, upsert: true }
  );

  // Access the specific progress field based on the 'type' argument
  const progressType = progress[type];

  if (!progressType) {
    throw new Error(`Invalid progress type: ${type}`);
  }

  // Find the index of the existing assessment, if any
  const existingAssessmentIndex = progressType.assessments.findIndex(
    (assessment) => assessment.assessmentId.toString() === assessmentID
  );

  const assessmentData = {
    assessmentId: assessmentID,
    takenAt: new Date(),
    evaluationResult: { overallScore: score },
    ...(audioUrl && { audioUrl }),
    ...(audioPublicId && { audioPublicId }),
  };

  if (existingAssessmentIndex === -1) {
    // Add new assessment if it doesn't exist
    progressType.assessments.push(assessmentData);
  } else {
    // Update the existing assessment
    progressType.assessments[existingAssessmentIndex] = {
      ...(progressType.assessments[existingAssessmentIndex].toObject?.() || {}),
      ...assessmentData,
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

  await progress.save();
}

export {
  analyzeReadingAssessment,
  analyzeListeningAssessment,
  analyzeGrammarAssessment,
  analyzeVocabularyAssessment,
  analyzeSpeakingAssessment,
};
