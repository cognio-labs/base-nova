export const OPENROUTER_MODELS = {
  coding: "qwen/qwen3-coder:free",
  uiDesign: "minimax/minimax-m2.5:free",
  reasoning: "openai/gpt-oss-120b:free",
  fast: "qwen/qwen3-next-80b-a3b-instruct:free",
  quick: "openai/gpt-oss-20b:free",
  automation: "baidu/cobuddy:free",
  deepThinking: "arcee-ai/trinity-large-thinking:free",
  longContext: "nousresearch/hermes-3-llama-3.1-405b:free",
  debugging: "deepseek/deepseek-v4-flash:free",
} as const;

type ModelRoute = keyof typeof OPENROUTER_MODELS;

const ROUTE_KEYWORDS: Record<ModelRoute, string[]> = {
  coding: [
    "api",
    "backend",
    "code",
    "component",
    "database",
    "endpoint",
    "next.js",
    "nextjs",
    "react",
    "route",
    "tailwind",
    "typescript",
  ],
  uiDesign: [
    "animation",
    "beautiful",
    "dashboard",
    "design",
    "frontend",
    "glassmorphism",
    "landing",
    "modern",
    "premium",
    "saas",
    "ui",
    "ux",
  ],
  reasoning: [
    "agent",
    "architecture",
    "complex",
    "logic",
    "orchestration",
    "plan",
    "reason",
    "system",
    "workflow",
  ],
  fast: ["fast", "lightweight", "simple", "summary"],
  quick: ["quick", "small", "tiny", "short"],
  automation: ["automate", "automation", "bot", "integration", "schedule", "tool"],
  deepThinking: ["advanced", "analyze", "deep", "strategy", "thinking"],
  longContext: ["conversation", "history", "long", "memory", "remember"],
  debugging: ["bug", "debug", "error", "exception", "fail", "fix", "issue", "not working", "stack trace"],
};

const ROUTE_PRIORITY: ModelRoute[] = [
  "debugging",
  "coding",
  "uiDesign",
  "reasoning",
  "automation",
  "deepThinking",
  "longContext",
  "fast",
  "quick",
];

function scoreRoute(text: string, route: ModelRoute) {
  return ROUTE_KEYWORDS[route].reduce((score, keyword) => {
    return text.includes(keyword) ? score + 1 : score;
  }, 0);
}

export function selectOpenRouterModel(userPrompt: string, systemPrompt = "") {
  const text = `${systemPrompt}\n${userPrompt}`.toLowerCase();

  const ranked = ROUTE_PRIORITY
    .map((route) => ({ route, score: scoreRoute(text, route) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || ROUTE_PRIORITY.indexOf(a.route) - ROUTE_PRIORITY.indexOf(b.route));

  const selectedRoute = ranked[0]?.route ?? "fast";

  return {
    route: selectedRoute,
    model: OPENROUTER_MODELS[selectedRoute],
  };
}
