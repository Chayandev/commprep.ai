import Groq from "groq-sdk";

const getTranscriptionAnalysis = async (
  transcription,
  topic,
  audioDuration
) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Construct the prompt for the AI
  const prompt = `
        Analyze the following transcription for grammar, relevance to the given topic, and adequacy of content length based on the audio duration. The analysis should consider that a well-developed response for a given topic should have an appropriate number of words or sentences relative to the audio length.The analysis should be short and to the point 
        Return the analysis in the following JSON format wihtout any extra text:
        {
          "grammarScore": <score out of 100>,
          "relevanceScore": <score out of 100>,
          "adequacyScore": <score out of 100>, // Based on whether the transcription has enough content relative to the audio duration
          "feedback": "<Detailed feedback on grammar, topic relevance, and content adequacy>",
          "suggestions": "<Specific suggestions for improving grammar, topic relevance, content adequacy, or clarity>"
        }
    
        Transcription: "${transcription.text}"
        Topic: "${topic}"
        Audio Duration (seconds): ${audioDuration}
        Word Count: ${transcription.words.length}
        
        Evaluate adequacyScore as follows:
        - If the transcription contains fewer than 3 words per second of audio, deduct points for insufficient content.
        - If the transcription is verbose or irrelevant to the topic, adjust the relevance score accordingly.
        Provide constructive feedback on how the user can improve their response to better match the topic and audio duration.
      `;

  // Perform the request to Groq API
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    // Ensure the result is returned as JSON
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    console.log(result);
    return result;
    //  return JSON.parse(result); // Parse the JSON response for further use
  } catch (error) {
    console.error("Error during transcription analysis:", error);
    throw new Error("Failed to analyze transcription");
  }
};

export { getTranscriptionAnalysis };
