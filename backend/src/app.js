import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16Kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/", (req, res, next) => {
  res.send("Hello form HTTPS commprep.ai server");
});
// import schemeRouter from "./routes/schemes.routers.js";

// app.use("/api/v1/schemes", schemeRouter);

export { app };
