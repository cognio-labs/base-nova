import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { files, projectTitle } = await req.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Define the base directory for saving. 
    // We'll save inside a 'generated' folder in the project root for safety.
    const baseDir = path.join(process.cwd(), 'generated', projectTitle || 'untitled-app');

    // Create the base directory if it doesn't exist
    await fs.mkdir(baseDir, { recursive: true });

    // Write each file
    for (const file of files) {
      const filePath = path.join(baseDir, file.path);
      const fileDir = path.dirname(filePath);

      // Ensure directory exists for the file
      await fs.mkdir(fileDir, { recursive: true });

      // Write the content
      await fs.writeFile(filePath, file.content, 'utf8');
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully saved ${files.length} files to ${baseDir}` 
    });

  } catch (error: any) {
    console.error('LokoAI File Save Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save files' }, { status: 500 });
  }
}
