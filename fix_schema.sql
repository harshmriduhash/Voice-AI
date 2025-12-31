-- Run this in Supabase SQL Editor to ensure tables exist

-- 1. Create conversations table
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table conversations enable row level security;

create policy "Users can view their own conversations." on conversations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own conversations." on conversations
  for insert with check (auth.uid() = user_id);

-- 2. Create messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  text text,
  audio_duration_sec integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table messages enable row level security;

create policy "Users can view messages from their conversations." on messages
  for select using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages to their conversations." on messages
  for insert with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );
