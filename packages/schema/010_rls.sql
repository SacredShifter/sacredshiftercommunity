alter table profiles enable row level security;
create policy "self_select" on profiles for select using (auth.uid() = id);
create policy "self_update" on profiles for update using (auth.uid() = id);

alter table journal_entries enable row level security;
create policy "own_read" on journal_entries for select using (auth.uid() = user_id);
create policy "own_write" on journal_entries for insert with check (auth.uid() = user_id);

alter table codex_entries enable row level security;
create policy "own_read" on codex_entries for select using (auth.uid() = user_id);
create policy "own_write" on codex_entries for insert with check (auth.uid() = user_id);

alter table dream_entries enable row level security;
create policy "own_read" on dream_entries for select using (auth.uid() = user_id);
create policy "own_write" on dream_entries for insert with check (auth.uid() = user_id);

-- circles are public-readable, messages readable per-circle (adjust later)
alter table circles enable row level security;
create policy "public_list" on circles for select using (true);

alter table circle_messages enable row level security;
create policy "circle_read" on circle_messages for select using (exists (
  select 1 from circles c where c.id = circle_messages.circle_id
));
-- Insert policy should check membership once memberships table is ready.
