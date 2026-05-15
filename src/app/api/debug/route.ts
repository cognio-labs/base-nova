import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
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

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an elite software debugger. Respond only with JSON.' },
        { role: 'user', content: debugPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more precise debugging
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from AI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('LokoAI Debug Engine Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
