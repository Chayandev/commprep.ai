import Groq from "groq-sdk";
import { logger } from "../logger/logger.js";

/**
 * Shared Groq client instance for all assessment analysis helpers.
 * Instantiated once and reused — avoids creating a new client on every request.
 */
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Make a Groq chat completion call and return parsed JSON with comprehensive logging.
 *
 * @param {string} prompt       - The user prompt to send
 * @param {number} temperature  - Sampling temperature (default 0.5)
 * @param {string} model        - Model name (defaults to env GROQ_MODEL or llama-3.3-70b-versatile)
 * @returns {Promise<object>}   - Parsed JSON object from the LLM response
 * @throws {Error}              - Re-throws if the Groq call fails
 */
const callGroq = async (
  prompt,
  temperature = 0.5,
  model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
) => {
  const startTime = Date.now();
  logger.info("Initiating Groq LLM completion", {
    model,
    promptLength: prompt.length,
    temperature,
  });

  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature,
    });

    const elapsedMs = Date.now() - startTime;
    const content = response.choices[0]?.message?.content || "{}";

    logger.info("Groq LLM completion successful", {
      model,
      elapsedMs,
      usage: response.usage,
      finishReason: response.choices[0]?.finish_reason,
    });

    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      logger.error("Failed to parse Groq response content as JSON", {
        rawContent: content,
        parseError: parseError.message,
      });
      throw new Error("Invalid JSON structure in Groq response");
    }
  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    logger.error("Groq LLM API call failed", {
      model,
      elapsedMs,
      errorMessage: error.message,
      status: error.status,
      stack: error.stack,
    });
    throw error;
  }
};

export { groq, callGroq };
