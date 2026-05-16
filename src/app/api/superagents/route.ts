import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { getCurrentUser } from '@/lib/supabase';
import { getErrorMessage, unauthorizedResponse } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const orchestrationPrompt = `
      You are the LokoAI Superagent Orchestrator. 
      You will simulate a collaborative workflow between 4 specialized agents to build the user's project: "${prompt}".
      
      The agents are:
      1. Product Manager (PM): Defines features and structure.
      2. UI/UX Designer: Sets the visual theme and component layout.
      3. Lead Developer: Writes the production-ready code.
      4. QA Tester: Audits for errors and quality.

      Return a JSON response with the following structure:
      {
        "projectTitle": "String",
        "workflowLogs": [
          { "agent": "Product Manager", "action": "Analyzing requirements and defining core features..." },
          { "agent": "UI/UX Designer", "action": "Designing layout, color palette, and Tailwind theme..." },
          { "agent": "Lead Developer", "action": "Building components and implementing logic..." },
          { "agent": "QA Tester", "action": "Running syntax checks and auditing code quality..." }
        ],
        "pmSpecs": "String (Description of what PM decided)",
        "designSpecs": "String (Description of visual choices)",
        "files": [
          { "path": "String", "content": "String" }
        ],
        "previewHtml": "String (Self-contained preview)"
      }

      Ensure the code is high-quality, production-ready.

      Always create websites using these technologies only:
      - TypeScript
      - React
      - Next.js
      - Tailwind CSS
      - HTML5
      - CSS3
      - TSX
      - JSX

      Rules:
      - Use TypeScript for all components
      - Use React functional components
      - Use Next.js App Router structure
      - Use Tailwind CSS for all styling
      - Create responsive modern SaaS UI
      - Use clean folder structure
      - Use reusable components
      - Use modern animations and gradients
      - Generate production-ready code only
      - Avoid plain HTML websites unless requested
    `;

    const content = await getGeminiResponse('You are an elite multi-agent orchestration engine. Respond only with JSON.', orchestrationPrompt, true);
    if (!content) throw new Error('No content returned');

    return NextResponse.json(JSON.parse(content));

  } catch (error: unknown) {
    console.error('LokoAI Superagent Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) || 'Internal Server Error' }, { status: 500 });
  }
}
