import { getGeminiResponse } from "@/lib/gemini";
import { getOpenRouterResponse } from "@/lib/openrouter";
import { getOpenRouterAgentResponse } from "@/lib/openrouterAgent";

type AIProvider = "gemini" | "openrouter" | "openrouter_agent";

function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  if (provider === "gemini" || provider === "openrouter" || provider === "openrouter_agent") {
    return provider;
  }

  // Default to agent when OpenRouter is configured (gives us tools + better format handling),
  // and fall back internally if the key/model is invalid.
  return process.env.OPENROUTER_API_KEY ? "openrouter_agent" : "gemini";
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

  return getGeminiResponse(systemPrompt, userPrompt, isJson);
}
