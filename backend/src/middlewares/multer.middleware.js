import multer from "multer";
import crypto from "crypto";
import path from "path";

// using diskstorage with unique filename generation to prevent concurrent request overwrites
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // destination folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".wav";
    const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });