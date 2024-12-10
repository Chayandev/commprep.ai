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

export { analyzeAgainstPassageAndGenerateFeedback   };
