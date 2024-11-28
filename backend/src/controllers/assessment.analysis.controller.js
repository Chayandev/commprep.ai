import { asyncHandelr } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { ApiError } from "../utils/ApiErros.js";
import fs from "fs"; // Import the fs module to handle file operations
import { AssemblyAI } from "assemblyai";
import { ReadingAssessment } from "../models/readingAssessments.model.js";
import { ListeningAssessment } from "../models/listeningAssessment.model.js";
import { User } from "../models/user.model.js";
import { GrammarAssessment } from "../models/grammarAssessment.model.js";
import { VocabularyAssessment } from "../models/vocabularyAssessment.model.js";

// Initialize the AssemblyAI client with the API key
const assemblyClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

/**
 * Analyze a reading assessment by transcribing an audio file and
 * comparing it to a given passage, updating the user's progress and
 * assessment data based on the transcription results.
 */
const analyzeReadingAssessment = asyncHandelr(async (req, res) => {
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
 * Analyze transcription data against an actual passage and generate feedback.
 * This function checks accuracy, pronunciation confidence, and provides feedback.
 */
async function analyzeAgainstPassageAndGenerateFeedback(
  transcriptionData,
  actualPassage
) {
  // Validate inputs
  if (!transcriptionData || !actualPassage) {
    return {
      accuracy: "0.0%",
      pronunciationConfidence: "0.0%",
      overallScore: "0.0",
      feedback: "No transcription data or passage provided.",
      suggestion: "Please provide valid data for analysis.",
    };
  }

  // Prepare words and passage for comparison
  const words = transcriptionData.words || [];
  const transcriptionText = transcriptionData.text
    ? transcriptionData.text.toLowerCase()
    : "";
  const actualText = actualPassage.toLowerCase();
  const passageWords = actualText
    .split(" ")
    .filter((word) => word.trim() !== "");

  let correctMatches = 0;
  let substitutions = 0;
  let insertions = 0;
  let deletions = 0;
  let pronunciationIssues = [];
  let punctuationIssues = [];

  // Compare transcription to the passage
  for (let i = 0; i < passageWords.length; i++) {
    const originalWord = passageWords[i];
    const transcribedWord = words[i] ? words[i].text || null : null;
    const confidenceScore = words[i] ? words[i].confidence : null;

    if (transcribedWord === originalWord) {
      correctMatches++;
      if (confidenceScore < 0.6) {
        punctuationIssues.push(transcribedWord);
      }
    } else if (transcribedWord) {
      substitutions++;
      pronunciationIssues.push(transcribedWord);
    } else {
      deletions++;
    }
  }

  // Calculate insertions
  if (words.length > passageWords.length) {
    insertions = words.length - passageWords.length;
  }

  // Compute feedback and scores
  const averageConfidence = transcriptionData.confidence || 0;
  const accuracyRate = (correctMatches / passageWords.length) * 100 || 0;
  const overallScore = ((accuracyRate + averageConfidence * 100) / 2) * 0.1;

  // Generate feedback based on analysis results
  let feedback = "";
  let suggestion = "";
  if (accuracyRate >= 90) feedback += "Excellent accuracy!#";
  else if (accuracyRate >= 70)
    feedback += "Good accuracy, but there’s room for improvement.#";
  else feedback += "Accuracy could be improved. Pay attention to each word.#";

  if (averageConfidence > 0.9)
    feedback += "Pronunciation is very clear and confident.#";
  else if (averageConfidence > 0.7)
    feedback += "Good pronunciation, though some words could be clearer.#";
  else
    feedback +=
      "Consider practicing pronunciation, especially on complex words.#";

  if (substitutions > 0)
    suggestion +=
      "Review words with pronunciation issues: " +
      pronunciationIssues.join(", ") +
      ".#";
  if (insertions > 0) suggestion += "Try to avoid adding extra words.#";
  if (deletions > 0) suggestion += "Pay attention to omitted words.#";

  if (punctuationIssues.length > 0) {
    suggestion +=
      "Words with low confidence include: " +
      punctuationIssues.join(", ") +
      ".#";
  }

  return {
    accuracy: `${accuracyRate.toFixed(1)}%`,
    pronunciationConfidence: `${(averageConfidence * 100).toFixed(1)}%`,
    overallScore: overallScore.toFixed(1),
    feedback,
    suggestion,
  };
}
//*************************************************************************************/

/**
 *
 * Analyzes listening assessment responses and updates the user's progress.
 *
 */
const analyzeListeningAssessment = asyncHandelr(async (req, res) => {
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

const generateFeedbackAndSuggestions = async (score, totalQuestions) => {
  let feedback = "";
  let suggestions = "";
  const scorePercentage = (score / totalQuestions) * 100;
  if (scorePercentage >= 80) {
    feedback = "Excellent job! Your listening skills are impressive.";
    suggestions = "Try challenging yourself with more complex audio.";
  } else if (scorePercentage >= 50) {
    feedback = "Good work! Keep practicing.";
    suggestions = "Try listening to various accents for improvement.";
  } else {
    feedback = "Don't be discouraged. Keep practicing!";
    suggestions = "Start with slower-paced audio for better understanding.";
  }

  return { feedback, suggestions };
};
//*************************************************************************************/

/**
 *
 * Analyzes grammar assessment responses and updates the user's progress.
 *
 */
const analyzeGrammarAssessment = asyncHandelr(async (req, res) => {
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
const analyzeVocabularyAssessment = asyncHandelr(async (req, res) => {
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
 * Calculate score
 */
const calculateScore = async (assessmentModel, answers, assessmentID) => {
  const assessment = await assessmentModel.findById(assessmentID).exec();

  if (!assessment) throw new ApiError(400, "Assessment not found");

  let score = 0;
  const totalQuestions = assessment.mcqQuestions.length;

  // Calculate score based on correct answers
  assessment.mcqQuestions.forEach((question, index) => {
    const userAnswer = answers[index.toString()];
    if (userAnswer && userAnswer === question.options[question.correctOption]) {
      score += 1;
    }
  });

  return { score, totalQuestions, assessment };
};
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
  analyzeVocabularyAssessment
};
