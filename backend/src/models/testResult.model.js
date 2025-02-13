import mongoose, { Schema } from "mongoose";

const testResultSchema = new Schema(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: "Tests",
      required: true,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        scores: {
          reading: { type: Number, default: 0 },
          speaking: { type: Number, default: 0 },
          listening: { type: Number, default: 0 },
          grammar: { type: Number, default: 0 },
          vocabulary: { type: Number, default: 0 },
          totalScore: { type: Number, default: 0 },
        },
        lastUpdated: { type: Date, default: Date.now }, // Track last update
      },
    ],
  },
  { timestamps: true }
);

export const TestResults = mongoose.model("TestResults", testResultSchema);
