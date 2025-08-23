create extension if not exists pgcrypto;
create extension if not exists vector;

-- profiles
create table if not exists profiles (
  id uuid primary key,
  display_name text,
  avatar_url text,
  soul_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- circles
create table if not exists circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- circle_messages
create table if not exists circle_messages (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid references circles(id) on delete cascade not null,
  user_id uuid not null,
  content text not null,
  message_type text default 'text',
  created_at timestamptz default now()
);

-- codex
create table if not exists codex_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  body text not null,
  tags text[],
  created_at timestamptz default now()
);

-- journal & dreams
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content text not null,
  mood text,
  created_at timestamptz default now()
);

create table if not exists dream_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  raw_text text not null,
  symbols text[],
  created_at timestamptz default now()
);
