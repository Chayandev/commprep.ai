import mongoose, { Schema } from "mongoose";

const readingAssesmentSchema = new Schema(
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const ReadingAssesment = mongoose.model(
  "ReadingAssesment",
  readingAssesmentSchema
);
