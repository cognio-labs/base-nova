import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const modelName = process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-1.5-flash";

export async function getGeminiResponse(systemPrompt: string, userPrompt: string, isJson: boolean = false) {
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: systemPrompt,
  });

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    if (isJson) {
      // Gemini sometimes wraps JSON in markdown blocks.
      text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
    }

    return text;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gemini error";
    throw new Error(`Gemini request failed with model "${modelName}": ${message}`);
  }
}
