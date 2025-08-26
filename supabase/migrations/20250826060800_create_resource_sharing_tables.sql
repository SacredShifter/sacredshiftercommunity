-- Resources table
create table resources (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('youtube', 'website', 'podcast', 'article')),
  url text not null,
  title text,
  description text,
  thumbnail_url text,
  submitted_by uuid references profiles(id) on delete cascade,
  resonance_note text,
  created_at timestamp with time zone default now()
);

-- Circle resources (many-to-many)
create table circle_resources (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid references circles(id) on delete cascade,
  resource_id uuid references resources(id) on delete cascade,
  pinned boolean default false,
  created_at timestamp with time zone default now()
);

-- Policies
alter table resources enable row level security;
alter table circle_resources enable row level security;

-- Basic policies
create policy "users can insert their own resources"
  on resources for insert
  with check (auth.uid() = submitted_by);

create policy "users can view all resources"
  on resources for select
  using (true);

create policy "circle members can view circle resources"
  on circle_resources for select
  using (
    exists (
      select 1 from circle_memberships m
      where m.circle_id = circle_resources.circle_id
      and m.user_id = auth.uid()
    )
  );
