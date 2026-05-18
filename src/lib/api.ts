import { NextResponse } from "next/server";

export function getErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (message.includes('OpenRouter request failed') && message.includes('User not found')) {
    return 'Your OpenRouter API key is invalid or no longer active. Add a fresh key in .env.local as OPENROUTER_API_KEY and restart the dev server.';
  }

  if (message.includes('OpenRouter request failed') && message.includes('401')) {
    return 'OpenRouter authentication failed. Check OPENROUTER_API_KEY in .env.local and restart the dev server.';
  }

  if (message.includes('OpenRouter request failed') && message.includes('429')) {
    return 'OpenRouter is rate-limiting requests right now. Wait a moment and try again.';
  }

  return message;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

export function sanitizeProjectTitle(title: string) {
  return title.replace(/[^a-z0-9-_ ]/gi, "").trim().replace(/\s+/g, "-") || "untitled-app";
}