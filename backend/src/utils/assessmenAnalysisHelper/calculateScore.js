import { ApiError } from "../ApiErros.js";

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

export { calculateScore };
