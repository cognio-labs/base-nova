import { getGeminiResponse } from "@/lib/gemini";
import { getOpenRouterResponse } from "@/lib/openrouter";

type AIProvider = "gemini" | "openrouter";

function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  if (provider === "gemini" || provider === "openrouter") {
    return provider;
  }

  return process.env.OPENROUTER_API_KEY ? "openrouter" : "gemini";
}

export async function getAIResponse(
  systemPrompt: string,
  userPrompt: string,
  isJson: boolean = false
) {
  const provider = getAIProvider();

  if (provider === "openrouter") {
    return getOpenRouterResponse(systemPrompt, userPrompt, isJson);
  }

  return getGeminiResponse(systemPrompt, userPrompt, isJson);
}
