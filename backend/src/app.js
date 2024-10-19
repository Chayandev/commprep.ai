import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiErros.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16Kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// app.use("/", (req, res, next) => {
//   res.send("Hello form HTTPS commprep.ai server");
// });

import userRouter from "./routes/user.routes.js";

//routes decalration
app.use("/api/v1/users", userRouter);

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
  // Default error handling for any other error types
  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    success: false,
    errors: [],
    data: null,
  });
});
export { app };
