import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { getCurrentUser } from '@/lib/supabase';
import { getErrorMessage, unauthorizedResponse } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { prompt, files, errorMessage } = await req.json();

    if (!files || !errorMessage) {
      return NextResponse.json({ error: 'Files and error message are required' }, { status: 400 });
    }

    const debugPrompt = `
      You are an Expert Debugger at LokoAI. 
      The following code was generated based on this prompt: "${prompt}"
      
      However, it has the following error:
      "${errorMessage}"

      Here is the current code structure:
      ${JSON.stringify(files, null, 2)}

      Your task is to:
      1. Analyze the error.
      2. Fix the bugs or syntax errors in the files.
      3. Return the COMPLETE fixed file structure in JSON format.
      
      Always return your response in a strict JSON format:
      {
        "fixDescription": "String (Short explanation of what was fixed)",
        "files": [
          {
            "path": "String",
            "content": "String (Full corrected code)"
          }
        ],
        "previewHtml": "String (Updated HTML/CSS/JS for the sandbox)"
      }
    `;

    const content = await getGeminiResponse('You are an elite software debugger. Respond only with JSON.', debugPrompt, true);
    
    if (!content) {
      throw new Error('No content returned from AI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('LokoAI Debug Engine Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) || 'Internal Server Error' }, { status: 500 });
  }
}
