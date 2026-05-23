import { selectOpenRouterModel } from "@/lib/modelRouter";

const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const CHAT_COMPLETIONS_SUFFIX = "/chat/completions";

function normalizeBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");

  if (trimmed.endsWith(CHAT_COMPLETIONS_SUFFIX)) {
    return trimmed.slice(0, -CHAT_COMPLETIONS_SUFFIX.length);
  }

  return trimmed;
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

export function getOpenRouterConfig(userPrompt = "", systemPrompt = "") {
  const configuredBaseUrl =
    process.env.OPENROUTER_BASE_URL?.trim() || process.env.OPENROUTER_API_URL?.trim();
  const configuredModel = process.env.OPENROUTER_MODEL?.trim();
  const mistakenBaseUrl =
    !configuredBaseUrl && configuredModel && isHttpUrl(configuredModel) ? configuredModel : undefined;

  const apiBaseUrl = normalizeBaseUrl(
    configuredBaseUrl || mistakenBaseUrl || DEFAULT_OPENROUTER_BASE_URL
  );
  const routed = selectOpenRouterModel(userPrompt, systemPrompt);
  const model =
    configuredModel && !isHttpUrl(configuredModel) && configuredModel !== "auto"
      ? configuredModel
      : routed.model;

  return {
    apiBaseUrl,
    chatCompletionsUrl: `${apiBaseUrl}${CHAT_COMPLETIONS_SUFFIX}`,
    model,
    route: routed.route,
  };
}
