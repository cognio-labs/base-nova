import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai";
import { getErrorMessage } from "@/lib/api";
import { getOfflineGeneratedProject } from "@/lib/openrouter";

const GENERATION_TIMEOUT_MS = 28000;

function parseAIJson(content: string) {
  const trimmed = content
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }

    throw new Error("AI response was not valid JSON.");
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `
      You are an advanced AI Website Builder and AI IDE similar to Lovable, V0, and Bolt.
      Your job is to generate complete modern websites and web applications from user prompts.

      IMPORTANT:
      - Always generate full working code
      - Always create modern responsive UI
      - Always use production-ready structure
      - Always generate preview-ready applications
      - Always create and update files automatically

      Use ONLY these technologies:
      - Next.js (App Router)
      - React
      - TypeScript
      - Tailwind CSS
      - Shadcn UI
      - Framer Motion

      Frontend Rules:
      - Use functional React components
      - Use TypeScript in all files
      - Use Tailwind CSS only for styling
      - Create responsive layouts
      - Use modern premium SaaS UI design inspired by Lovable, Vercel, Linear, OpenAI, Stripe, Framer, and Apple
      - Use futuristic dashboard patterns, glassmorphism, dark/slate themes, neon glow, smooth gradients, and cinematic polish
      - Always make layouts responsive, accessible, scalable, and cleanly componentized
      - Add smooth Framer Motion animations where useful without hurting performance
      - Use Lucide React for icons
      - Maintain clean folder structure

      Return your response in a strict JSON format:
      {
        "projectTitle": "String",
        "description": "String",
        "files": [
          {
            "path": "String (relative path, e.g., components/Header.tsx)",
            "content": "String (Full code)"
          }
        ],
        "previewHtml": "String (Self-contained HTML/CSS/JS for live preview)"
      }

      Do not include any text outside the JSON block.
    `;

    const content = await Promise.race([
      getAIResponse(systemPrompt, prompt, true),
      new Promise<string>((resolve) =>
        setTimeout(
          () => resolve(JSON.stringify(getOfflineGeneratedProject(prompt))),
          GENERATION_TIMEOUT_MS
        )
      ),
    ]);

    if (!content) {
      throw new Error("No content returned from AI");
    }

    const result = parseAIJson(content);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("LokoAI Engine Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal Server Error" },
      { status: 500 }
    );
  }
}
