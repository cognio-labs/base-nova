import { NextResponse } from "next/server";
import { dbGetAllProjects, dbCreateProject } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const projects = dbGetAllProjects(limit, offset);
    return NextResponse.json({ projects });
  } catch (err: unknown) {
    console.error("Projects GET error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      title?: string;
      description?: string | null;
      prompt?: string | null;
      preview_html?: string | null;
      generated_code?: unknown[];
      chat_messages?: unknown[];
    };

    const project = dbCreateProject({
      id: crypto.randomUUID(),
      title: body.title || "Untitled Design",
      description: body.description ?? null,
      prompt: body.prompt ?? null,
      preview_html: body.preview_html ?? null,
      generated_code: Array.isArray(body.generated_code) ? body.generated_code : [],
      chat_messages: Array.isArray(body.chat_messages) ? body.chat_messages : [],
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err: unknown) {
    console.error("Projects POST error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
