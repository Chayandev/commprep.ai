import mongoose, { Schema } from "mongoose";
const userProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reading: {
      // completionPercentage: {
      //   type: Number,
      //   default: 0,
      // },
      assessments: [
        {
          assessmentId: {
            type: Schema.Types.ObjectId,
            ref: "ReadingAssessment",
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
    listening: {
      // completionPercentage: {
      //   type: Number,
      //   default: 0,
      // },
      assessments: [
        {
          assessmentId: {
            type: Schema.Types.ObjectId,
            ref: "ListeningAssessment",
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
    grammar: {
      // completionPercentage: {
      //   type: Number,
      //   default: 0,
      // },
      assessments: [
        {
          assessmentId: {
            type: Schema.Types.ObjectId,
            ref: "GrammarAssessment",
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
      // completionPercentage: {
      //   type: Number,
      //   default: 0,
      // },
      assessments: [
        {
          assessmentId: {
            type: Schema.Types.ObjectId,
            ref: "VocabularyAssessment",
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

    speaking: {
      // completionPercentage: {
      //   type: Number,
      //   default: 0,
      // },
      assessments: [
        {
          assessmentId: {
            type: Schema.Types.ObjectId,
            ref: "SpeakingAssessment",
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
    // test: {
    //   tests: [
    //     {
    //       testId: {
    //         type: Schema.Types.ObjectId,
    //         ref: "Tests",
    //       },
    //       takenAt: {
    //         type: Date,
    //       },
    //       evaluationResult: {
    //         overallScore: {
    //           type: Number,
    //         },
    //       },
    //     },
    //   ],
    // },
  },
  { timestamps: true }
);

export const UserProgress = mongoose.model("UserProgress", userProgressSchema);