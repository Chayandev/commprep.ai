import { ReadingAssesment } from "../models/readingAssesments.model.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { asyncHandelr } from "../utils/asyncHandler.js";

const addReadingAssesment = asyncHandelr(async (req, res) => {
  const { passage, difficulty, timeToComplete } = req.body;

  // Directly create and save the new assessment document
  const newAssessment = await ReadingAssesment.create({
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

//get all reading assesments
const getReadingAssesments = asyncHandelr(async (req, res) => {
  const userId = req.user._id;

  const assessments = await ReadingAssesment.aggregate([
    {
      $addFields: {
        isCompleted: {
          $cond: {
            if: { $isArray: "$assessmentCompleters" },
            then: { $in: [userId, "$assessmentCompleters"] },
            else: false,
          },
        },
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
export { addReadingAssesment, getReadingAssesments };
