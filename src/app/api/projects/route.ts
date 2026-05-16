import { NextResponse } from "next/server";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase";
import { getErrorMessage, unauthorizedResponse } from "@/lib/api";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,description,preview_url,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ projects: data });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { title, description, generated_code, preview_url } = await req.json();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title,
        description,
        generated_code: generated_code || [],
        preview_url,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
