import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export { app };
