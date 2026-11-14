import { callGroq } from "./groqClient.js";
import { logger } from "../logger/logger.js";

/**
 * Normalize a word for comparison:
 * - Lowercase
 * - Strip leading/trailing punctuation (commas, periods, quotes, etc.)
 */
function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
}

/**
 * Word Error Rate (WER) alignment using Wagner-Fischer dynamic programming.
 *
 * Compares a reference sequence (passage words) against a hypothesis sequence
 * (spoken words) and returns a full edit-operation alignment.
 *
 * Each operation is one of:
 *   { type: "correct",      ref: word, hyp: word }
 *   { type: "substitution", ref: word, hyp: word }   ← wrong word said
 *   { type: "deletion",     ref: word, hyp: null }   ← word was skipped
 *   { type: "insertion",    ref: null,  hyp: word }   ← extra word added
 *
 * @param {string[]} reference  - passage words (what should be said)
 * @param {string[]} hypothesis - spoken words (what was actually said)
 * @returns {Array} alignment operations
 */
function werAlign(reference, hypothesis) {
  const R = reference.length;
  const H = hypothesis.length;

  // Build the DP cost table (R+1) x (H+1)
  const dp = Array.from({ length: R + 1 }, (_, i) =>
    Array.from({ length: H + 1 }, (_, j) => {
      if (i === 0) return j; // insert all hyp words
      if (j === 0) return i; // delete all ref words
      return 0;
    })
  );

  for (let i = 1; i <= R; i++) {
    for (let j = 1; j <= H; j++) {
      if (reference[i - 1] === hypothesis[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // correct — no cost
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // substitution
          dp[i - 1][j],     // deletion
          dp[i][j - 1]      // insertion
        );
      }
    }
  }

  // Backtrack through the DP table to build the alignment
  const ops = [];
  let i = R;
  let j = H;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && reference[i - 1] === hypothesis[j - 1]) {
      ops.unshift({ type: "correct", ref: reference[i - 1], hyp: hypothesis[j - 1] });
      i--; j--;
    } else if (
      i > 0 && j > 0 &&
      dp[i][j] === dp[i - 1][j - 1] + 1
    ) {
      ops.unshift({ type: "substitution", ref: reference[i - 1], hyp: hypothesis[j - 1] });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.unshift({ type: "deletion", ref: reference[i - 1], hyp: null });
      i--;
    } else {
      ops.unshift({ type: "insertion", ref: null, hyp: hypothesis[j - 1] });
      j--;
    }
  }

  return ops;
}

/**
 * Convert a reading WPM value into a 0–100 pace score and a human label.
 *
 * @param {number} wpm
 * @returns {{ score: number, label: string }}
 */
function getPaceScore(wpm) {
  if (wpm >= 120 && wpm <= 160) return { score: 100, label: "Natural reading pace. Well done." };
  if (wpm >= 100 && wpm < 120) return { score: 75, label: "Slightly slow. Try to increase your pace a little." };
  if (wpm > 160 && wpm <= 185) return { score: 75, label: "Slightly fast. Focus on clear pronunciation." };
  if (wpm >= 80 && wpm < 100) return { score: 50, label: "Reading slowly. Aim for 120–160 words per minute." };
  if (wpm > 185 && wpm <= 210) return { score: 50, label: "Reading too fast. Slow down for better clarity." };
  if (wpm < 80) return { score: 25, label: "Very slow pace. Practice reading continuously without pausing." };
  return { score: 25, label: "Very fast pace. Slow down significantly." };
}

/**
 * Analyze a reading assessment by comparing the AssemblyAI transcript against
 * the original passage using Word Error Rate alignment.
 *
 * Returns:
 *  - overallScore       : weighted composite (Number 0–100)
 *  - wordAccuracy       : { score, correct, total, missedWords, changedWords }
 *  - addedWords         : string[] — filler/extra words the user spoke
 *  - readingPace        : { wpm, score, label }
 *  - clarity            : { score, lowClarityWords }
 *  - feedback           : string — human-readable overall feedback
 *  - suggestion         : string — specific actionable suggestion
 *
 * @param {object} transcriptionData  - AssemblyAI transcript object
 * @param {string} actualPassage      - the original passage text
 * @param {number} audioDuration      - audio length in seconds (from transcript.audio_duration)
 */
async function analyzeAgainstPassageAndGenerateFeedback(
  transcriptionData,
  actualPassage,
  audioDuration = 0
) {
  // ── Guard: empty inputs ──────────────────────────────────────────────────
  if (!transcriptionData || !actualPassage) {
    return {
      overallScore: 0,
      wordAccuracy: { score: 0, correct: 0, total: 0, missedWords: [], changedWords: [] },
      addedWords: [],
      readingPace: { wpm: 0, score: 0, label: "No audio data available." },
      clarity: { score: 0, lowClarityWords: [] },
      feedback: "No transcription data or passage provided.",
      suggestion: "Please provide valid audio and passage data.",
    };
  }

  // ── 1. Normalize both sequences ──────────────────────────────────────────
  const spokenWords = (transcriptionData.words || []);                // AssemblyAI word objects
  const spokenNorm = spokenWords.map((w) => normalizeWord(w.text));  // normalized spoken strings
  const passageNorm = actualPassage
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);                                                   // normalized passage strings

  // ── 2. Run WER alignment ─────────────────────────────────────────────────
  const alignment = werAlign(passageNorm, spokenNorm);

    // ── 3. Collect per-operation results ────────────────────────────────────
    const missedWords = []; // deletions  — words in passage that were skipped
    const changedWords = []; // substitutions — { expected, spoke }
    const addedWords = []; // insertions  — extra words the user added

  let correctCount = 0;

  alignment.forEach((op) => {
    if (op.type === "correct") correctCount++;
    if (op.type === "deletion") missedWords.push(op.ref);
    if (op.type === "substitution") changedWords.push({ expected: op.ref, spoke: op.hyp });
    if (op.type === "insertion") addedWords.push(op.hyp);
  });

  // ── 4. Word Accuracy ─────────────────────────────────────────────────────
  const totalPassageWords = passageNorm.length;
  const wordAccuracyScore = totalPassageWords > 0
    ? Number(((correctCount / totalPassageWords) * 100).toFixed(1))
    : 0;

  // ── 5. Reading Pace (WPM) ────────────────────────────────────────────────
  const duration = audioDuration || transcriptionData.audio_duration || 0;
  const totalSpoken = spokenWords.length;
  const wpm = duration > 0 ? Math.round(totalSpoken / (duration / 60)) : 0;
  const pace = wpm > 0 ? getPaceScore(wpm) : { score: 0, label: "No speech detected." };

  // ── 6. Clarity Score ─────────────────────────────────────────────────────
  const overallClarity = Number(
    ((transcriptionData.confidence || 0) * 100).toFixed(1)
  );

  // Words AssemblyAI was uncertain about (confidence < 0.65)
  const lowClarityWords = spokenWords
    .filter((w) => typeof w.confidence === "number" && w.confidence < 0.65)
    .map((w) => w.text);

  // ── 7. Overall Score (weighted composite) ────────────────────────────────
  // Weights: Accuracy 60% | Clarity 25% | Pace 15%
  const overallScore = Number(
      (
        wordAccuracyScore * 0.60 +
        overallClarity * 0.25 +
        pace.score * 0.15
      ).toFixed(1)
  );

  // ── 8. Generate Feedback & Suggestion via Groq LLM ─────────────────────
  // Scores are always computed mathematically above (trustworthy + deterministic).
  // Groq is used only to turn those numbers into natural, personalized coach language.
  let feedback   = "";
  let suggestion = "";

  try {
    const prompt = `
You are an English communication coach reviewing a user's reading aloud assessment.
Based on the metrics below, write two short responses in JSON format:
1. "feedback"   — 2–3 sentences. Acknowledge what the user did well, then mention the main area to improve. Be encouraging and specific.
2. "suggestion" — 1–2 sentences. Give ONE concrete, actionable thing they can do before their next session.

Keep the tone supportive, like a real coach. Be direct — avoid generic filler phrases like "Great job overall!".

Metrics:
- Word Accuracy:   ${wordAccuracyScore}% (${correctCount} of ${totalPassageWords} passage words said correctly)
- Missed Words:    ${missedWords.length > 0 ? missedWords.slice(0, 5).join(", ") : "none"}
- Changed Words:   ${changedWords.length > 0 ? changedWords.slice(0, 3).map(c => `"${c.expected}" spoken as "${c.spoke}"`).join(", ") : "none"}
- Added Words:     ${addedWords.length > 0 ? addedWords.slice(0, 5).join(", ") : "none"}
- Reading Pace:    ${wpm > 0 ? `${wpm} WPM — ${pace.label}` : "could not be measured"}
- Clarity Score:   ${overallClarity}%
- Unclear Words:   ${lowClarityWords.length > 0 ? lowClarityWords.slice(0, 5).join(", ") : "none"}

Return ONLY valid JSON, no extra text:
{ "feedback": "...", "suggestion": "..." }
    `.trim();

    const parsed = await callGroq(prompt, 0.5);
    feedback   = parsed.feedback   || "";
    suggestion = parsed.suggestion || "";
  } catch (err) {
    // callGroq failed — fall back to rule-based text so the endpoint never breaks
    logger.warn("Groq feedback generation failed, using rule-based fallback", {
      error: err.message,
    });
  }

  // ── Fallback: rule-based text if Groq returned empty or threw ────────────
  if (!feedback) {
    if (wordAccuracyScore >= 90)
      feedback = `Excellent! You read ${correctCount} of ${totalPassageWords} words correctly (${wordAccuracyScore}%). Your clarity was ${overallClarity >= 85 ? "very strong" : "good"}.`;
    else if (wordAccuracyScore >= 70)
      feedback = `Good effort. You read ${correctCount} of ${totalPassageWords} words correctly (${wordAccuracyScore}%). ${pace.label}`;
    else
      feedback = `You read ${correctCount} of ${totalPassageWords} words correctly (${wordAccuracyScore}%). Focus on reading each word carefully. ${pace.label}`;
  }

  if (!suggestion) {
    if (missedWords.length > 0)
      suggestion = `You skipped ${missedWords.length} word(s): "${missedWords.slice(0, 3).join('", "')}". Try reading the passage line by line, pausing at each word.`;
    else if (changedWords.length > 0)
      suggestion = `Practice these words you said incorrectly: ${changedWords.slice(0, 2).map(c => `"${c.expected}"`).join(", ")}. Say each one slowly before reading the full passage again.`;
    else if (lowClarityWords.length > 0)
      suggestion = `Speak more clearly on: "${lowClarityWords.slice(0, 3).join('", "')}". Slow down on complex words to improve your clarity score.`;
    else
      suggestion = "Excellent session! Try a medium-difficulty passage next to challenge your pace and vocabulary.";
  }

  // ── 9. Return full result ─────────────────────────────────────────────────
  return {
    overallScore,
    wordAccuracy: {
      score:       wordAccuracyScore,
      correct:     correctCount,
      total:       totalPassageWords,
      missedWords,
      changedWords,
    },
    addedWords,
    readingPace: {
      wpm,
      score: pace.score,
      label: pace.label,
    },
    clarity: {
      score:         overallClarity,
      lowClarityWords,
    },
    feedback,
    suggestion,
  };
}

export { analyzeAgainstPassageAndGenerateFeedback };
