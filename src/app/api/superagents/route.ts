import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
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

      Ensure the code is high-quality, production-ready, and uses Next.js patterns.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an elite multi-agent orchestration engine. Respond only with JSON.' },
        { role: 'user', content: orchestrationPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content returned');

    return NextResponse.json(JSON.parse(content));

  } catch (error: any) {
    console.error('LokoAI Superagent Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
