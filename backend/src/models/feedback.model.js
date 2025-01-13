import mongoose, { Schema } from "mongoose";

const userFeedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedbacks: [
      {
        title: {
          type: String,
          required: true,
        },
        feedbackDescription: {
          type: String,
          required: true,
        },
        feedbackType: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          default: 0,
        },
        acceptToBeContacted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);
export const UserFeedback = mongoose.model("UserFeedback", userFeedbackSchema);
