import { NextResponse } from "next/server";

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

export function sanitizeProjectTitle(title: string) {
  return title.replace(/[^a-z0-9-_ ]/gi, "").trim().replace(/\s+/g, "-") || "untitled-app";
}
