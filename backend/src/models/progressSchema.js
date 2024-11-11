// import mongoose, { Schema } from "mongoose";

// const progressSchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//     reading: {
//       completionParcentage: {
//         type: Number,
//         default: 0,
//       },
//       assesments: [
//         {
//           assesmentId: {
//             type: Schema.Types.ObjectId,
//             ref: "ReadingAssessment",
//           },
//           takenAt: {
//             type: Date,
//           },
//           evaluationResult: {
//             overallScore: {
//               type: Number,
//             },
//           },
//         },
//       ],
//     },
//     listening: {
//       completionParcentage: {
//         type: Number,
//         default: 0,
//       },
//       assesments: [
//         {
//           assesmentId: {
//             type: Schema.Types.ObjectId,
//             ref: "ListeningAssessment",
//           },
//           takenAt: {
//             type: Date,
//           },
//           evaluationResult: {
//             overallScore: {
//               type: Number,
//             },
//           },
//         },
//       ],
//     },
//     grammer: {
//       completionParcentage: {
//         type: Number,
//         default: 0,
//       },
//       assesments: [
//         {
//           assesmentId: {
//             type: Schema.Types.ObjectId,
//             ref: "GrammerAssessment",
//           },
//           takenAt: {
//             type: Date,
//           },
//           evaluationResult: {
//             overallScore: {
//               type: Number,
//             },
//           },
//         },
//       ],
//     },
//     vocabulary: {
//       completionParcentage: {
//         type: Number,
//         default: 0,
//       },
//       assesments: [
//         {
//           assesmentId: {
//             type: Schema.Types.ObjectId,
//             ref: "VocabularyAssessment",
//           },
//           takenAt: {
//             type: Date,
//           },
//           evaluationResult: {
//             overallScore: {
//               type: Number,
//             },
//           },
//         },
//       ],
//     },
//   },
//   { timestamps: true }
// );

// export const Progress = mongoose.model("Progress", progressSchema);
