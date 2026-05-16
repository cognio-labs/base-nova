import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createSupabaseServerClient, getCurrentUser } from '@/lib/supabase';
import { getErrorMessage, sanitizeProjectTitle, unauthorizedResponse } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { files, projectTitle, description, previewHtml } = await req.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const safeTitle = sanitizeProjectTitle(projectTitle || 'untitled-app');
    const baseDir = path.join(process.cwd(), 'generated', user.id, safeTitle);

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

    const supabase = await createSupabaseServerClient();
    const { error: dbError } = await supabase.from('projects').insert({
      user_id: user.id,
      title: projectTitle || 'Untitled App',
      description: description || null,
      generated_code: files,
      preview_url: previewHtml || null,
    });

    if (dbError) throw dbError;

    return NextResponse.json({ 
      success: true, 
      message: `Saved ${files.length} files to your LokoAI workspace` 
    });

  } catch (error: unknown) {
    console.error('LokoAI File Save Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) || 'Failed to save files' }, { status: 500 });
  }
}
