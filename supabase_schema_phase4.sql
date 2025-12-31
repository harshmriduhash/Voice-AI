
-- Extend profiles table (if not already done, though we created it in phase 2)
-- We assume profiles exists. We might need to ensure RLS allows updates for credits.

-- Create conversations table
create table conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table conversations enable row level security;

create policy "Users can view their own conversations." on conversations
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own conversations." on conversations
  for insert with check ((select auth.uid()) = user_id);

-- Create messages table
create table messages (
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
      and conversations.user_id = (select auth.uid())
    )
  );

create policy "Users can insert messages to their conversations." on messages
  for insert with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
    )
  );

-- Create coupons table
create table coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  description text,
  bonus_credits integer not null,
  max_redemptions integer not null,
  redemptions_count integer default 0,
  expires_at timestamp with time zone
);

alter table coupons enable row level security;

create policy "Everyone can read coupons (for validation)." on coupons
  for select using (true);

-- Create user_coupons table (to track redemptions)
create table user_coupons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  coupon_id uuid references coupons(id) on delete cascade not null,
  redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, coupon_id)
);

alter table user_coupons enable row level security;

create policy "Users can view their own redeemed coupons." on user_coupons
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own redeemed coupons." on user_coupons
  for insert with check ((select auth.uid()) = user_id);

-- Seed a sample coupon
insert into coupons (code, description, bonus_credits, max_redemptions)
values ('CAPSTONE_KING', 'Special bonus for the king', 1000, 100)
on conflict (code) do nothing;
