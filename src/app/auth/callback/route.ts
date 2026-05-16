import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/workspace";

  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin));
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
