import mongoose, { Schema } from "mongoose";

const readingAssessmentSchema = new Schema(
  {
    passage: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
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

export const ReadingAssessment = mongoose.model(
  "ReadingAssessment",
  readingAssessmentSchema
);
