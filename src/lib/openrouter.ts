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

function stripJsonFences(text: string) {
  return text
    .replace(/```json\s*/i, "```")
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function toTitleFromPrompt(prompt: string) {
  const cleaned = prompt
    .replace(/[^a-z0-9\s-_]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Generated Website";

  const words = cleaned.split(" ").slice(0, 4);
  const titled = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return titled;
}

function getOfflineJson(userPrompt: string) {
  const projectTitle = toTitleFromPrompt(userPrompt);
  const description = userPrompt.trim() || "Offline generated starter";

  const previewHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectTitle}</title>
    <style>
      :root{color-scheme:light}
      *{box-sizing:border-box}
      body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; background: radial-gradient(1200px 800px at 20% 10%, #dbeafe, #ffffff); color:#0f172a;}
      .wrap{max-width:1100px;margin:0 auto;padding:48px 20px 64px}
      .card{background:rgba(255,255,255,.7);backdrop-filter:blur(10px);border:1px solid rgba(15,23,42,.08);border-radius:24px;box-shadow:0 20px 60px rgba(15,23,42,.08);padding:28px}
      .grid{display:grid;grid-template-columns:1.2fr .8fr;gap:22px;align-items:start}
      h1{margin:0 0 10px;font-size:42px;letter-spacing:-.03em}
      p{margin:0 0 16px;line-height:1.6;color:#334155}
      .pill{display:inline-flex;gap:8px;align-items:center;padding:10px 14px;border-radius:999px;background:rgba(14,165,233,.10);border:1px solid rgba(14,165,233,.25);color:#0369a1;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.12em}
      .btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
      .btn{border:0;border-radius:14px;padding:12px 14px;font-weight:800;cursor:pointer}
      .primary{background:#0ea5e9;color:white}
      .secondary{background:white;border:1px solid rgba(15,23,42,.12);color:#0f172a}
      .list{display:grid;gap:10px;margin-top:14px}
      .item{padding:12px 14px;border-radius:16px;background:white;border:1px solid rgba(15,23,42,.08)}
      .muted{font-size:12px;color:#64748b}
      @media (max-width:900px){.grid{grid-template-columns:1fr}}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="pill">Offline Mode • No API key</div>
      <div style="height:14px"></div>
      <div class="card">
        <div class="grid">
          <div>
            <h1>${projectTitle}</h1>
            <p>${description}</p>
            <div class="btns">
              <button class="btn primary" onclick="alert('Next step: connect an API when ready')">Generate Pages</button>
              <button class="btn secondary" onclick="alert('This is a local offline preview')">Preview</button>
            </div>
            <div class="list">
              <div class="item"><strong>Hero</strong><div class="muted">Headline + CTA ready</div></div>
              <div class="item"><strong>Sections</strong><div class="muted">Features, testimonials, pricing</div></div>
              <div class="item"><strong>Export</strong><div class="muted">Save files into generated/</div></div>
            </div>
          </div>
          <div class="item">
            <strong>Why offline?</strong>
            <div class="muted" style="margin-top:8px">Your OpenRouter key is missing/invalid, so LokoAI is generating a starter template locally. Add a valid key later to enable AI generation.</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;

  return {
    projectTitle,
    workflowLogs: [
      { agent: "Product Manager", action: "Offline: outlining structure..." },
      { agent: "UI/UX Designer", action: "Offline: choosing a clean style..." },
      { agent: "Lead Developer", action: "Offline: generating starter files..." },
      { agent: "QA Tester", action: "Offline: sanity checks..." },
    ],
    pmSpecs: `Offline mode: basic structure for "${projectTitle}"`,
    designSpecs: "Light, modern, glassy card layout",
    files: [
      {
        path: "app/page.tsx",
        content:
          "export default function Page() {\n  return (\n    <main style={{ padding: 24, fontFamily: 'system-ui' }}>\n      <h1>" +
          projectTitle.replace(/"/g, "\\\"") +
          "</h1>\n      <p>" +
          description.replace(/"/g, "\\\"") +
          "</p>\n    </main>\n  );\n}\n",
      },
      {
        path: "app/layout.tsx",
        content:
          "export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n",
      },
    ],
    previewHtml,
  };
}

async function requestOpenRouter(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
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
      }),
    });

    const data = (await response.json()) as OpenRouterResponse;

    if (response.ok) {
      return data;
    }

    const isRetryable = RETRYABLE_STATUS_CODES.has(response.status);
    if (!isRetryable || attempt === MAX_RETRIES) {
      throw new Error(
        `OpenRouter request failed (${response.status}) with model "${model}": ${
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

  // If key is missing, fall back to offline generation for JSON flows.
  if (!apiKey) {
    if (isJson) return JSON.stringify(getOfflineJson(userPrompt));
    throw new Error("Missing OPENROUTER_API_KEY in environment variables.");
  }

  try {
    const data = await requestOpenRouter(apiKey, model, systemPrompt, userPrompt);
    let text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error(`OpenRouter returned no content with model "${model}".`);
    }

    if (isJson) {
      text = stripJsonFences(text);
    }

    return text;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    // If the key/model is invalid, return an offline starter so the app still works.
    if (isJson && (message.includes("(401)") || message.toLowerCase().includes("invalid"))) {
      return JSON.stringify(getOfflineJson(userPrompt));
    }

    throw error;
  }
}

