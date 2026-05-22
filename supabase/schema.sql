-- LokoAI Public Schema
-- No authentication required - all projects are public
-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Drop existing tables if they exist and recreate with new structure
drop table if exists public.generations cascade;
drop table if exists public.projects cascade;
drop table if exists public.profiles cascade;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null, -- nullable: supports anonymous creation
  title text not null default 'Untitled Design',
  description text,
  prompt text, -- original user prompt that created this design
  generated_code jsonb not null default '[]'::jsonb,
  preview_html text, -- Full self-contained HTML for live preview
  chat_messages jsonb not null default '[]'::jsonb, -- Chat history per project
  session_key text, -- anonymous session tracking
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Profiles policies (auth users only for their own profile)
drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
on public.profiles for select using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id) with check (auth.uid() = id);

-- Projects policies - FULLY PUBLIC (no auth required)
drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Projects are publicly readable"
on public.projects for select using (true);

drop policy if exists "Projects are publicly insertable" on public.projects;
create policy "Projects are publicly insertable"
on public.projects for insert with check (true);

drop policy if exists "Projects are publicly updatable" on public.projects;
create policy "Projects are publicly updatable"
on public.projects for update using (true) with check (true);

drop policy if exists "Projects are publicly deletable" on public.projects;
create policy "Projects are publicly deletable"
on public.projects for delete using (true);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.update_updated_at();

-- Profile creation trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Indexes
create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_user_id_idx on public.projects (user_id) where user_id is not null;
