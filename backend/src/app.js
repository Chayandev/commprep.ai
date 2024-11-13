import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiErros.js";
const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN
        : "http://localhost:5173",
    credentials: true,
  })
);
// Set a larger limit for incoming request bodies
app.use(express.json({ limit: "10mb" })); // Example limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// app.use("/", (req, res, next) => {
//   res.send("Hello form HTTPS commprep.ai server");
// });

import userRouter from "./routes/user.routes.js";

//routes decalration
app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  res.send({
    msg: "Commprep.ai server",
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
