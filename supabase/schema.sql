-- Tasks table for the AI Productivity Assistant
-- Run this in the Supabase SQL Editor to recreate the table.

create table public.tasks (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users (id) on delete cascade default auth.uid(),
  title       text not null check (char_length(trim(title)) between 1 and 100),
  description text not null default '' check (char_length(description) <= 500),
  due_date    date,
  priority    text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status      text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  completed   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at fresh whenever a row changes
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();