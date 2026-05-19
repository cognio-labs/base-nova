-- Offline starter schema
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  description text,
  generated_code jsonb default '[]'::jsonb,
  preview_url text,
  created_at timestamptz default now()
);
