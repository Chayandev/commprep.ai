import { parseFile } from "music-metadata";
import { logger } from "../logger/logger.js";

const getAudioDuration = async (audioPath) => {
  try {
    const metadata = await parseFile(audioPath);
    const durationInSeconds = metadata.format.duration;
    logger.info("Local audio duration parsed", { durationInSeconds, audioPath });
    return durationInSeconds;
  } catch (error) {
    logger.error("Failed to parse local audio duration", {
      audioPath,
      error: error.message,
    });
    throw new Error("Failed to retrieve audio duration");
  }
};

export { getAudioDuration };
