import mongoose, { Schema } from "mongoose";
import { mcqSchema } from "./listeningAssessment.model.js";

const grammarAssessmentSchema = new Schema(
  {
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    mcqQuestions: [mcqSchema],
    evaluationCriteria: {
      timeToComplete: {
        type: Number,
        required: true,
      },
    },
    assessmentCompleters: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const GrammarAssesment = mongoose.model(
  "GrammarAssessment",
  grammarAssessmentSchema
);
