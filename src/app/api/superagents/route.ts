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
      You are the LokoAI Superagent Orchestrator, an advanced AI IDE system.
      You will simulate a collaborative workflow between 4 specialized agents to build the user's project.
      
      The agents are:
      1. Product Manager (PM): Defines features and structure.
      2. UI/UX Designer: Sets the visual theme (Glassmorphism, SaaS premium effects).
      3. Lead Developer: Writes production-ready code (Next.js, Tailwind, Framer Motion).
      4. QA Tester: Audits for errors and quality.

      IMPORTANT RULES:
      - Always generate full working code (no placeholders)
      - Use Next.js App Router, TypeScript, and Shadcn UI
      - Create responsive, visually stunning layouts
      - Follow modern SaaS design principles automatically

      Return a JSON response with the following structure:
      {
        "projectTitle": "String",
        "workflowLogs": [
          { "agent": "Product Manager", "action": "Analyzing requirements..." },
          { "agent": "UI/UX Designer", "action": "Designing layout..." },
          { "agent": "Lead Developer", "action": "Building components..." },
          { "agent": "QA Tester", "action": "Auditing code..." }
        ],
        "pmSpecs": "String",
        "designSpecs": "String",
        "files": [
          { "path": "String", "content": "String" }
        ],
        "previewHtml": "String"
      }
    `;

    const content = await Promise.race([
      getAIResponse(
        systemPrompt,
        prompt,
        true
      ),
      new Promise<string>((resolve) =>
        setTimeout(
          () => resolve(JSON.stringify(getOfflineGeneratedProject(prompt))),
          GENERATION_TIMEOUT_MS
        )
      ),
    ]);

    if (!content) throw new Error("No content returned");

    return NextResponse.json(parseAIJson(content));
  } catch (error: unknown) {
    console.error("LokoAI Superagent Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Internal Server Error" },
      { status: 500 }
    );
  }
}
