import { NextResponse } from "next/server";
import { dbGetProject, dbUpdateProject, dbDeleteProject } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = dbGetProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err: unknown) {
    console.error("Project GET error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json() as {
      title?: string;
      description?: string | null;
      prompt?: string | null;
      preview_html?: string | null;
      generated_code?: unknown[];
      chat_messages?: unknown[];
      sandbox_id?: string | null;
    };

    // Auto-create if it doesn't exist yet (PUT is idempotent)
    const existing = dbGetProject(id);
    if (!existing) {
      const { dbCreateProject } = await import("@/lib/db");
      dbCreateProject({
        id,
        title: body.title ?? "Untitled Design",
        description: body.description ?? null,
        prompt: body.prompt ?? null,
        preview_html: body.preview_html ?? null,
        generated_code: Array.isArray(body.generated_code) ? body.generated_code : [],
        chat_messages: Array.isArray(body.chat_messages) ? body.chat_messages : [],
      });
    }

    const project = dbUpdateProject(id, {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.prompt !== undefined && { prompt: body.prompt }),
      ...(body.preview_html !== undefined && { preview_html: body.preview_html }),
      ...(body.generated_code !== undefined && { generated_code: body.generated_code }),
      ...(body.chat_messages !== undefined && { chat_messages: body.chat_messages }),
      ...(body.sandbox_id !== undefined && { sandbox_id: body.sandbox_id }),
    });

    return NextResponse.json({ project });
  } catch (err: unknown) {
    console.error("Project PUT error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    dbDeleteProject(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Project DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
