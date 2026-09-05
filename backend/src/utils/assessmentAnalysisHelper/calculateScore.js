import { ApiError } from "../apiHandler/ApiErros.js";

/**
 * Calculate score
 */
const calculateScore = async (assessmentModel, answers, assessmentID) => {
  
  const assessment = await assessmentModel.findById(assessmentID).exec();

  if (!assessment) throw new ApiError(400, "Assessment not found");

  let correctAnswers = 0;
  const totalQuestions = assessment.mcqQuestions.length;

  // Calculate score based on correct answers
  assessment.mcqQuestions.forEach((question, index) => {
    const userAnswer = answers[index.toString()];
    if (userAnswer && userAnswer === question.options[question.correctOption]) {
      correctAnswers += 1;
    }
  });

  const score = totalQuestions
    ? Number(((correctAnswers / totalQuestions) * 100).toFixed(1))
    : 0;

  return { score, correctAnswers, totalQuestions, assessment };
};

export { calculateScore };
