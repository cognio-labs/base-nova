const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-5.1-chat";
const MAX_RETRIES = 2;
const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestOpenRouter(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  isJson: boolean
) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
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

    if (response.ok) {
      return data;
    }

    const isRetryable = RETRYABLE_STATUS_CODES.has(response.status);
    if (!isRetryable || attempt === MAX_RETRIES) {
      throw new Error(
        `OpenRouter request failed with model "${model}": ${
          data.error?.message || response.statusText
        }`
      );
    }

    await delay(800 * (attempt + 1));
  }

  throw new Error(`OpenRouter request failed with model "${model}" after retries.`);
}

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

  const data = await requestOpenRouter(apiKey, model, systemPrompt, userPrompt, isJson);
  let text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(`OpenRouter returned no content with model "${model}".`);
  }

  if (isJson) {
    text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
  }

  return text;
}