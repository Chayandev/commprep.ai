import { parseFile } from "music-metadata";
const getAudioDuration = async (audioPath) => {
  try {
    // Parse the audio file
    const metadata = await parseFile(audioPath);
    const durationInSeconds = metadata.format.duration; // Duration in seconds
    console.log(`Audio Duration: ${durationInSeconds} seconds`);
    return durationInSeconds;
  } catch (error) {
    console.error("Error reading audio file:", error);
    throw new Error("Failed to retrieve audio duration");
  }
};

export { getAudioDuration as getAudioDuration };
