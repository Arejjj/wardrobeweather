-- Create wardrobe_items table
create table public.wardrobe_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  temp_min integer,
  temp_max integer,
  rain boolean default false,
  is_default boolean default false,
  photo text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.wardrobe_items enable row level security;

-- Create policies
create policy "Users can view their own items"
  on public.wardrobe_items
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own items"
  on public.wardrobe_items
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own items"
  on public.wardrobe_items
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own items"
  on public.wardrobe_items
  for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_wardrobe_items_user_id on public.wardrobe_items(user_id);
create index idx_wardrobe_items_created_at on public.wardrobe_items(created_at desc);
