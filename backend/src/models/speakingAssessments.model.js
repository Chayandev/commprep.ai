import mongoose, { Schema } from "mongoose";

const speakingAssessmentSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    evaluationCriteria: {
    
      timeToSpeak: {
        type: Number,
        required: true,
      },
      timeToThink: {
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

export const SpeakingAssessment = mongoose.model(
  "SpeakingAssessment",
  speakingAssessmentSchema
);
