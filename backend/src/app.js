import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/apiHandler/exports.js";
const app = express();

const corsOptions = {
  origin: [
    "https://commprep-ai.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "*",
  ], // Allow both local and production origins
  credentials: true, // If you need cookies or authentication headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable preflight across all routes

// Set a larger limit for incoming request bodies
app.use(express.json({ limit: "10mb" })); // Example limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// app.use("/", (req, res, next) => {
//   res.send("Hello form HTTPS commprep.ai server");
// });

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js"
//routes decalration
app.use("/api/v1/users", userRouter);
app.use("api/v1/admin",adminRouter);

app.use("*", (req, res, next) => {
  console.log("hit alive endpoint");
  res.status(200).json({
    statusCode: 200,
    message: "commprep.ai server",
  });
});

// Error handling middleware
// Error handling middleware
app.use((err, req, res, next) => {
  // Check if it's an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      success: false,
      errors: err.errors || [],
      data: null,
    });
  }

  // For any other errors, provide the exact error message instead of a generic one
  return res.status(err.status || 500).json({
    statusCode: err.status || 500,
    message: err.message || "An unknown error occurred",
    success: false,
    errors: err.stack ? [err.stack] : [], // Optionally include stack trace for debugging
    data: null,
  });
});

export { app };
