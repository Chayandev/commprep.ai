import { callGroq } from "./groqClient.js";
import { logger } from "../logger/logger.js";

/**
 * Analyze a speaking assessment transcription via Groq LLM.
 * Returns scores for grammar, relevance, and adequacy, plus feedback and suggestions.
 *
 * @param {object} transcription  - AssemblyAI transcript object { text, words, audio_duration }
 * @param {string} topic          - The speaking topic the user was given
 * @param {number} audioDuration  - Audio length in seconds
 * @returns {Promise<object>}     - { grammarScore, relevanceScore, adequacyScore, feedback, suggestions }
 */
const getTranscriptionAnalysis = async (transcription, topic, audioDuration) => {
  const wordCount = transcription.words?.length ?? 0;
  const wpm = audioDuration > 0 ? Math.round(wordCount / (audioDuration / 60)) : 0;

  const prompt = `
You are an English communication coach evaluating a spoken response.
Analyze the transcription below and return a JSON object with scores and feedback.

Return ONLY valid JSON, no extra text:
{
  "grammarScore":    <0–100, grammar correctness of the spoken sentences>,
  "relevanceScore":  <0–100, how well the response addresses the given topic>,
  "adequacyScore":   <0–100, whether the response is developed enough for the speaking duration>,
  "feedback":        "<2–3 sentences: what the user did well and what needs improvement>",
  "suggestions":     "<1–2 sentences: one specific, actionable improvement for next time>"
}

Scoring guidelines:
- grammarScore: Check for tense errors, subject-verb agreement, article usage, sentence structure.
- relevanceScore: Did the user stay on topic? Did they address the subject directly?
- adequacyScore: 
    * Speaking rate below 90 WPM (too slow/sparse) → deduct points
    * Speaking rate 90–180 WPM → full marks for pace
    * Speaking rate above 180 WPM (too fast/rambling) → deduct points
    * Shallow content (only surface points, no development) → deduct points

Context:
- Topic: "${topic}"
- Transcription: "${transcription.text}"
- Audio Duration: ${audioDuration} seconds
- Word Count: ${wordCount}
- Speaking Rate: ${wpm} WPM
  `.trim();

  try {
    const result = await callGroq(prompt, 0.4);
    logger.info("Speaking transcription analysis parsed successfully", {
      grammarScore: result.grammarScore,
      relevanceScore: result.relevanceScore,
      adequacyScore: result.adequacyScore,
    });
    return result;
  } catch (error) {
    logger.error("Error during speaking transcription analysis", {
      error: error.message,
      topic,
    });
    throw new Error("Failed to analyze transcription");
  }
};

export { getTranscriptionAnalysis };
