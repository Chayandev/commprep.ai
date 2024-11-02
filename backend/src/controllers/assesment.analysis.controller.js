import { asyncHandelr } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { ApiError } from "../utils/ApiErros.js";
import fs from "fs"; // Import the fs module to read files
import { AssemblyAI } from "assemblyai";

const assemblyClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

const analyzeReadingAssessment = asyncHandelr(async (req, res) => {
  const { passage } = req.body;
  console.log(passage);

  if (!passage) {
    throw new ApiError(400, "Passage is Required to analyze the audio");
  }

  console.log(req.files);
  let audioLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.audio) &&
    req.files.audio.length > 0
  ) {
    audioLocalPath = req.files.audio[0].path;
  }
  if (!audioLocalPath) {
    throw new ApiError(400, "Audio File is required");
  }

  // Attempt to transcribe the audio file
  const transcript = await assemblyClient.transcripts.transcribe({
    audio: audioLocalPath,
  });

  // Log the response for debugging
  console.log("Transcription Response:", transcript);

  // Check if transcription returned valid data
  if (!transcript) {
    throw new ApiError(500, "Transcription failed or returned invalid data");
  }

  // Call the function with valid data
  const response = await analyzeAgainstPassageAndGenerateFeedback(
    transcript,
    passage
  );

  //unlink the audio file
  fs.unlinkSync(audioLocalPath);

  // Return the transcription result
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Successfully transcribed"));
});

/// Generate feedback alogrihtm
async function analyzeAgainstPassageAndGenerateFeedback(
  transcriptionData,
  actualPassage
) {
  // Check if transcriptionData and actualPassage are valid
  if (!transcriptionData || !actualPassage) {
    return {
      accuracy: "0.0%",
      pronunciationConfidence: "0.0%",
      overallScore: "0.0",
      feedback: "No transcription data or passage provided.",
      suggestion: "Please provide valid data for analysis.",
    };
  }

  const words = transcriptionData.words || []; // Ensure it's an array
  const transcriptionText = transcriptionData.text
    ? transcriptionData.text.toLowerCase()
    : "";
  const actualText = actualPassage.toLowerCase();

  // Edge case: Check if there are no words in transcription
  if (words.length === 0) {
    return {
      accuracy: "0.0%",
      pronunciationConfidence: "0.0%",
      overallScore: "0.0",
      feedback: "No words were transcribed.",
      suggestion: "Ensure that your microphone is working and try again.",
    };
  }

  const passageWords = actualText
    .split(" ")
    .filter((word) => word.trim() !== "");

  let correctMatches = 0;
  let substitutions = 0;
  let insertions = 0;
  let deletions = 0;
  let pronunciationIssues = [];
  let punctuationIssues = []; // Array to hold words with punctuation issues or low confidence

  // Compare words and calculate matches
  for (let i = 0; i < passageWords.length; i++) {
    const originalWord = passageWords[i];
    const transcribedWord = words[i] ? words[i].text || null : null; // Ensure safe access
    const confidenceScore = words[i] ? words[i].confidence : null; // Get the confidence score for the word

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

  // Check for insertions
  if (words.length > passageWords.length) {
    insertions = words.length - passageWords.length;
  }

  // Use provided confidence score
  const averageConfidence = transcriptionData.confidence || 0; // Default to 0 if confidence is missing
  const accuracyRate = (correctMatches / passageWords.length) * 100 || 0;
  const overallScore = ((accuracyRate + averageConfidence * 100) / 2) * 0.1; // overall out of 10

  // Generate dynamic feedback
  let feedback = "";
  let suggestion = "";

  // Dynamic feedback based on performance
  if (accuracyRate >= 90) {
    feedback += "Excellent accuracy!\n";
  } else if (accuracyRate >= 70) {
    feedback += "Good accuracy, but there’s room for improvement.\n";
  } else {
    feedback += "Accuracy could be improved. Pay attention to each word.\n";
  }

  if (averageConfidence > 0.9) {
    feedback += "Pronunciation is very clear and confident.\n";
  } else if (averageConfidence > 0.7) {
    feedback += "Good pronunciation, though some words could be clearer.\n";
  } else {
    feedback +=
      "Consider practicing pronunciation, especially on complex words.\n";
  }

  // Dynamic suggestions based on errors
  if (substitutions > 0) {
    suggestion +=
      "Review words that were substituted or have pronunciation issues, such as: " +
      pronunciationIssues.join(", ") +
      ".\n";
  }
  if (insertions > 0) {
    suggestion += "Try to avoid adding extra words.\n";
  }
  if (deletions > 0) {
    suggestion += "Pay attention to omitted words.\n";

    // Additional encouragement if accuracy was low
    if (accuracyRate < 70) {
      suggestion += "Practice reading passages slowly to improve accuracy.\n";
    }
  }

  // Add punctuation issues to feedback if there are any
  if (punctuationIssues.length > 0) {
    suggestion +=
      "Words with low confidence scores include: " +
      punctuationIssues.join(", ") +
      ".\n";
  }

  return {
    accuracy: `${accuracyRate.toFixed(1)}%`,
    pronunciationConfidence: `${(averageConfidence * 100).toFixed(1)}%`,
    overallScore: overallScore.toFixed(1),
    feedback,
    suggestion,
  };
}

export { analyzeReadingAssessment };
