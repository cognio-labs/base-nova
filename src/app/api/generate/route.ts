import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getCurrentUser } from '@/lib/supabase';
import { getErrorMessage, unauthorizedResponse } from '@/lib/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `
      You are an elite full-stack engineer and the core engine of LokoAI.
      Your task is to generate production-ready code based on user prompts.
      
      Always return your response in a strict JSON format:
      {
        "projectTitle": "String",
        "description": "String",
        "files": [
          {
            "path": "String (relative path from root, e.g., components/Button.tsx)",
            "content": "String (full code content)"
          }
        ],
        "previewHtml": "String (A self-contained HTML/CSS/JS file for the live preview iframe. Use Tailwind via CDN and Lucide via CDN if needed.)"
      }

      Use:
      - Next.js (App Router) for files list
      - Tailwind CSS
      - TypeScript
      - Lucide React for icons
      
      Do not include any text outside the JSON block.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from AI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('LokoAI Engine Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) || 'Internal Server Error' }, { status: 500 });
  }
}
