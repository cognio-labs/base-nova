-- LokoAI Supabase schema
-- Run this in Supabase SQL Editor after creating your project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  generated_code jsonb not null default '[]'::jsonb,
  preview_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_name text not null,
  status text not null default 'queued',
  logs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.generations enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Projects are readable by owner" on public.projects;
create policy "Projects are readable by owner"
on public.projects for select
using (auth.uid() = user_id);

drop policy if exists "Projects are insertable by owner" on public.projects;
create policy "Projects are insertable by owner"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Projects are updatable by owner" on public.projects;
create policy "Projects are updatable by owner"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Projects are deletable by owner" on public.projects;
create policy "Projects are deletable by owner"
on public.projects for delete
using (auth.uid() = user_id);

drop policy if exists "Generations are readable by project owner" on public.generations;
create policy "Generations are readable by project owner"
on public.generations for select
using (
  exists (
    select 1 from public.projects
    where projects.id = generations.project_id
    and projects.user_id = auth.uid()
  )
);

drop policy if exists "Generations are insertable by project owner" on public.generations;
create policy "Generations are insertable by project owner"
on public.generations for insert
with check (
  exists (
    select 1 from public.projects
    where projects.id = generations.project_id
    and projects.user_id = auth.uid()
  )
);

drop policy if exists "Generations are updatable by project owner" on public.generations;
create policy "Generations are updatable by project owner"
on public.generations for update
using (
  exists (
    select 1 from public.projects
    where projects.id = generations.project_id
    and projects.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects
    where projects.id = generations.project_id
    and projects.user_id = auth.uid()
  )
);

drop policy if exists "Generations are deletable by project owner" on public.generations;
create policy "Generations are deletable by project owner"
on public.generations for delete
using (
  exists (
    select 1 from public.projects
    where projects.id = generations.project_id
    and projects.user_id = auth.uid()
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
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

create index if not exists projects_user_id_created_at_idx
on public.projects (user_id, created_at desc);

create index if not exists generations_project_id_created_at_idx
on public.generations (project_id, created_at desc);
