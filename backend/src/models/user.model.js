import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const progressSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    progress: {
      type: progressSchema,
      default: () => ({
        reading: { assessments: [] },
        listening: { assessments: [] },
        grammar: { assessments: [] },
        vocabulary: { assessments: [] },
      }),
    },
    achivements: [
      {
        type: String,
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpireAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

//pre-hook runs to encrypt the password
userSchema.pre("save", async function (next) {
  // this hook calls when user will save the data with password
  //add condition for this runs only when password changes
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//add some additional methods to run
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //return boolean
};

//generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//genrate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
