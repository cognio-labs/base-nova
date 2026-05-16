import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function getGeminiResponse(systemPrompt: string, userPrompt: string, isJson: boolean = false) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  let text = response.text();

  if (isJson) {
    // Gemini sometimes wraps JSON in markdown blocks
    text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
  }

  return text;
}
