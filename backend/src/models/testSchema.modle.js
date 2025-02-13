import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sections: [
      {
        reading: {
          type: Schema.Types.ObjectId,
          ref: "ReadingAssessment",
          required: true,
        },
        timeLimit: {
          type: Number, // Time limit in minutes
          required: true,
        },
      },
      {
        listening: {
          type: Schema.Types.ObjectId,
          ref: "ListeningAssessment",
          required: true,
        },
        timeLimit: {
          type: Number, // Time limit in minutes
          required: true,
        },
      },
      {
        speaking: {
          type: Schema.Types.ObjectId,
          ref: "SpeakingAssessment",
          required: true,
        },
        timeLimit: {
          type: Number, // Time limit in minutes
          required: true,
        },
      },
      {
        grammer: {
          type: Schema.Types.ObjectId,
          ref: "GrammarAssessment",
          required: true,
        },
        timeLimit: {
          type: Number, // Time limit in minutes
          required: true,
        },
      },
      {
        vocabulary: {
          type: Schema.Types.ObjectId,
          ref: "VocabularyAssessment",
          required: true,
        },
        timeLimit: {
          type: Number, // Time limit in minutes
          required: true,
        },
      },
    ],
    totalTestTime: {
      type: Number,
      required: true,
      default: 0,
    },
    // participants: [
    //   {
    //     userId: {
    //       type: Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     scores: {
    //       reading: { type: Number, default: 0 },
    //       speaking: { type: Number, default: 0 },
    //       listening: { type: Number, default: 0 },
    //       grammar: { type: Number, default: 0 },
    //       vocabulary: { type: Number, default: 0 },
    //       totalScore: { type: Number, default: 0 },
    //     },
    //     completedAt: {
    //       type: Date,
    //       default: null,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

export const Tests = mongoose.model("Tests", testSchema);
