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

export { generateFeedbackAndSuggestions };
