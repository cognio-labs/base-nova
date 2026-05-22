/**
 * push-schema.mjs
 * Pushes supabase/schema.sql to your Supabase project using the Management API.
 *
 * Usage:
 *   node scripts/push-schema.mjs
 *
 * Requires SUPABASE_ACCESS_TOKEN in .env.local
 * Get yours at: https://supabase.com/dashboard/account/tokens
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, "..");

// ─── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.local not found — rely on real env vars
  }
}

loadEnv();

// ─── Resolve project ref from SUPABASE URL ────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
const projectRef = match?.[1];

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!projectRef) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL not set or invalid in .env.local");
  process.exit(1);
}

if (!accessToken) {
  console.error(`
❌  SUPABASE_ACCESS_TOKEN is not set in .env.local

How to get it (30 seconds):
  1. Go to https://supabase.com/dashboard/account/tokens
  2. Click "Generate new token"
  3. Give it any name (e.g. "local-push")
  4. Copy the token
  5. Add to .env.local:
       SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxx
  6. Re-run:  node scripts/push-schema.mjs
`);
  process.exit(1);
}

// ─── Read schema SQL ──────────────────────────────────────────────────────────
const schemaPath = resolve(root, "supabase", "schema.sql");
let schemaSql;
try {
  schemaSql = readFileSync(schemaPath, "utf8");
} catch {
  console.error("❌  Could not read supabase/schema.sql");
  process.exit(1);
}

// ─── Push via Management API ──────────────────────────────────────────────────
console.log(`🚀  Pushing schema to project: ${projectRef}`);
console.log("    (This may take a few seconds...)\n");

const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

try {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: schemaSql }),
  });

  const text = await res.text();

  if (res.ok) {
    console.log("✅  Schema pushed successfully!\n");
    console.log("    Tables created:");
    console.log("    • public.projects   (public RLS, no auth required)");
    console.log("    • public.profiles   (auth users only)");
    console.log("\n    You can verify in Supabase Dashboard → Table Editor.\n");
  } else {
    // Try to parse for a readable error
    let errMsg = text;
    try {
      const json = JSON.parse(text);
      errMsg = json.message || json.error || JSON.stringify(json, null, 2);
    } catch {
      // keep raw text
    }
    console.error(`❌  Supabase API returned ${res.status}:\n    ${errMsg}`);
    process.exit(1);
  }
} catch (err) {
  console.error("❌  Network error:", err.message);
  process.exit(1);
}
