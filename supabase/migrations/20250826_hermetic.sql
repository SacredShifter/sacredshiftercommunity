-- Hermetic module core tables (idempotent-ish: guard with IF NOT EXISTS where supported)
create table if not exists hermetic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  principle text not null check (principle in (
    'mentalism','correspondence','vibration','polarity','rhythm','cause_effect','gender'
  )),
  status text not null default 'incomplete' check (status in ('incomplete','in_progress','complete')),
  score int default 0,
  attempts int default 0,
  last_interaction timestamptz default now(),
  unique(user_id, principle)
);

create table if not exists hermetic_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  principle text not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  settings jsonb default '{}'::jsonb,
  outcome jsonb default '{}'::jsonb
);

create table if not exists hermetic_events (
  id bigserial primary key,
  user_id uuid not null,
  principle text not null,
  etype text not null,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS
alter table hermetic_progress enable row level security;
create policy if not exists "user can manage own progress" on hermetic_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table hermetic_sessions enable row level security;
create policy if not exists "user read own sessions" on hermetic_sessions for select using (auth.uid() = user_id);
create policy if not exists "user write own sessions" on hermetic_sessions for insert with check (auth.uid() = user_id);
create policy if not exists "user update own sessions" on hermetic_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table hermetic_events enable row level security;
create policy if not exists "user write own events" on hermetic_events for insert with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists idx_hp_user_principle on hermetic_progress (user_id, principle);
create index if not exists idx_he_user_time on hermetic_events (user_id, created_at desc);
