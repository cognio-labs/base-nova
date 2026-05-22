/**
 * src/lib/db.ts
 * SQLite persistence layer using better-sqlite3.
 * Replaces Supabase for local-first project storage.
 */
import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { resolve } from "path";

// ─── DB location ──────────────────────────────────────────────────────────────
const DATA_DIR = resolve(process.cwd(), ".data");
mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = resolve(DATA_DIR, "nova.db");

// ─── Singleton connection ─────────────────────────────────────────────────────
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  applySchema(_db);
  return _db;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
function applySchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL DEFAULT 'Untitled Design',
      description  TEXT,
      prompt       TEXT,
      preview_html TEXT,
      generated_code TEXT NOT NULL DEFAULT '[]',
      chat_messages  TEXT NOT NULL DEFAULT '[]',
      sandbox_id   TEXT,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_projects_updated
      ON projects (updated_at DESC);
  `);

  // Non-destructive migration: add sandbox_id column if missing
  const cols = db
    .prepare("PRAGMA table_info(projects)")
    .all() as Array<{ name: string }>;
  if (!cols.some((c) => c.name === "sandbox_id")) {
    db.exec("ALTER TABLE projects ADD COLUMN sandbox_id TEXT");
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  prompt: string | null;
  preview_html: string | null;
  generated_code: string; // JSON
  chat_messages: string;  // JSON
  sandbox_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  prompt: string | null;
  preview_html: string | null;
  generated_code: Array<{ path: string; content: string }>;
  chat_messages: unknown[];
  sandbox_id: string | null;
  created_at: string;
  updated_at: string;
}

export function toProject(row: ProjectRow): Project {
  return {
    ...row,
    generated_code: safeParseArray(row.generated_code) as Array<{ path: string; content: string }>,
    chat_messages: safeParseArray(row.chat_messages),
  };
}

function safeParseArray(json: string | null): unknown[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export function dbGetAllProjects(limit = 50, offset = 0): Project[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, title, description, prompt, preview_html, generated_code,
              chat_messages, sandbox_id, created_at, updated_at
       FROM projects
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(limit, offset) as ProjectRow[];
  return rows.map(toProject);
}

export function dbGetProject(id: string): Project | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(id) as ProjectRow | undefined;
  return row ? toProject(row) : null;
}

export function dbCreateProject(data: {
  id: string;
  title?: string;
  description?: string | null;
  prompt?: string | null;
  preview_html?: string | null;
  generated_code?: unknown[];
  chat_messages?: unknown[];
}): Project {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO projects
       (id, title, description, prompt, preview_html, generated_code, chat_messages, created_at, updated_at)
     VALUES
       (@id, @title, @description, @prompt, @preview_html, @generated_code, @chat_messages, @created_at, @updated_at)`
  ).run({
    id: data.id,
    title: data.title ?? "Untitled Design",
    description: data.description ?? null,
    prompt: data.prompt ?? null,
    preview_html: data.preview_html ?? null,
    generated_code: JSON.stringify(data.generated_code ?? []),
    chat_messages: JSON.stringify(data.chat_messages ?? []),
    created_at: now,
    updated_at: now,
  });
  return dbGetProject(data.id)!;
}

export function dbUpdateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    prompt: string | null;
    preview_html: string | null;
    generated_code: unknown[];
    chat_messages: unknown[];
    sandbox_id: string | null;
  }>
): Project | null {
  const db = getDb();
  const fields: string[] = ["updated_at = @updated_at"];
  const params: Record<string, unknown> = {
    id,
    updated_at: new Date().toISOString(),
  };

  if ("title" in data) { fields.push("title = @title"); params.title = data.title; }
  if ("description" in data) { fields.push("description = @description"); params.description = data.description; }
  if ("prompt" in data) { fields.push("prompt = @prompt"); params.prompt = data.prompt; }
  if ("preview_html" in data) { fields.push("preview_html = @preview_html"); params.preview_html = data.preview_html; }
  if ("generated_code" in data) { fields.push("generated_code = @generated_code"); params.generated_code = JSON.stringify(data.generated_code); }
  if ("chat_messages" in data) { fields.push("chat_messages = @chat_messages"); params.chat_messages = JSON.stringify(data.chat_messages); }
  if ("sandbox_id" in data) { fields.push("sandbox_id = @sandbox_id"); params.sandbox_id = data.sandbox_id; }

  if (fields.length === 1) return dbGetProject(id); // nothing to update except timestamp

  db.prepare(`UPDATE projects SET ${fields.join(", ")} WHERE id = @id`).run(params);
  return dbGetProject(id);
}

export function dbDeleteProject(id: string): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  return info.changes > 0;
}
