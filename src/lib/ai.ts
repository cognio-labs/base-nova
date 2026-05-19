import { getGeminiResponse } from "@/lib/gemini";
import { getOpenRouterResponse } from "@/lib/openrouter";
import { getOpenRouterAgentResponse } from "@/lib/openrouterAgent";

type AIProvider = "gemini" | "openrouter" | "openrouter_agent";

function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  if (provider === "gemini" || provider === "openrouter" || provider === "openrouter_agent") {
    return provider;
  }

  // Prefer OpenRouter when available because it has a built-in offline JSON fallback.
  if (process.env.OPENROUTER_API_KEY) {
    return "openrouter_agent";
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return "gemini";
  }

  return "openrouter";
}

export async function getAIResponse(
  systemPrompt: string,
  userPrompt: string,
  isJson: boolean = false
) {
  const provider = getAIProvider();

  if (provider === "openrouter_agent") {
    try {
      return await getOpenRouterAgentResponse(systemPrompt, userPrompt, isJson);
    } catch {
      return getOpenRouterResponse(systemPrompt, userPrompt, isJson);
    }
  }

  if (provider === "openrouter") {
    return getOpenRouterResponse(systemPrompt, userPrompt, isJson);
  }

  try {
    return await getGeminiResponse(systemPrompt, userPrompt, isJson);
  } catch (error) {
    if (isJson) {
      return getOpenRouterResponse(systemPrompt, userPrompt, isJson);
    }

    throw error;
  }
}

