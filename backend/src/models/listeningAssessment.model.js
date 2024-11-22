import mongoose, { Schema } from "mongoose";

//The schema for MCQ questions
const mcqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [
      (options) => options.length === 4,
      "Each question must have  options",
    ],
    required: true,
  },
  correctOption: {
    type: Number,
    required: true,
  },
});

const saqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  expectedAnswer: {
    type: String,
  },
});

const listeningAssessmentSchema = new Schema(
  {
    audioFileUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    mcqQuestions: [mcqSchema],
    saqQuestions: [saqSchema],
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

export { mcqSchema };
export const ListeningAssessment = mongoose.model(
  "ListeningAssessment",
  listeningAssessmentSchema
);
