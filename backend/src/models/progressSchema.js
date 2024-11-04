import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reading: {
      completionParcentage: {
        type: Number,
        default: 0,
      },
      assesments: [
        {
          assesmentId: {
            type: Schema.Types.ObjectId,
            ref: "ReadingAssessment",
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          takenAt: {
            type: Date,
          },
          evaluationResult: {
            fluencyScore: {
              type: Number,
            },
            correctnessScore: {
              type: Number,
            },
            overallScore: {
              type: Number,
            },
          },
        },
      ],
    },
    listening: {
      completionParcentage: {
        type: Number,
        default: 0,
      },
      assesments: [
        {
          assesmentId: {
            type: Schema.Types.ObjectId,
            ref: "ListeningAssessment",
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          takenAt: {
            type: Date,
          },
          evaluationResult: {
            overallScore: {
              type: Number,
            },
          },
        },
      ],
    },
    grammer: {
      completionParcentage: {
        type: Number,
        default: 0,
      },
      assesments: [
        {
          assesmentId: {
            type: Schema.Types.ObjectId,
            ref: "GrammerAssessment",
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          takenAt: {
            type: Date,
          },
          evaluationResult: {
            overallScore: {
              type: Number,
            },
          },
        },
      ],
    },
    vocabulary: {
      completionParcentage: {
        type: Number,
        default: 0,
      },
      assesments: [
        {
          assesmentId: {
            type: Schema.Types.ObjectId,
            ref: "VocabularyAssessment",
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          takenAt: {
            type: Date,
          },
          evaluationResult: {
            overallScore: {
              type: Number,
            },
          },
        },
      ],
    },
  },
  { timestamps: true }
);

export const Progress = mongoose.model("Progress", progressSchema);
