const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-5.1-chat";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function getOpenRouterResponse(
  systemPrompt: string,
  userPrompt: string,
  isJson: boolean = false
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment variables.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:302",
      "X-OpenRouter-Title": "LokoAI",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      ...(isJson ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    throw new Error(
      `OpenRouter request failed with model "${model}": ${
        data.error?.message || response.statusText
      }`
    );
  }

  let text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(`OpenRouter returned no content with model "${model}".`);
  }

  if (isJson) {
    text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
  }

  return text;
}
