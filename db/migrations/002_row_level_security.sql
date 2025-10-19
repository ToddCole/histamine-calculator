-- Row Level Security setup

-- Enable RLS on all user tables
alter table public.user_profiles enable row level security;
alter table public.user_context_logs enable row level security;
alter table public.user_meals enable row level security;
alter table public.user_meal_items enable row level security;
alter table public.symptom_logs enable row level security;
alter table public.user_daily_rollups enable row level security;

-- Policies for user_profiles
create policy "Users can view own profile" on public.user_profiles
  for select using (user_id = auth.uid());
create policy "Users can insert own profile" on public.user_profiles
  for insert with check (user_id = auth.uid());
create policy "Users can update own profile" on public.user_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete own profile" on public.user_profiles
  for delete using (user_id = auth.uid());

-- Policies for user_context_logs
create policy "Users can view own context logs" on public.user_context_logs
  for select using (user_id = auth.uid());
create policy "Users can insert own context logs" on public.user_context_logs
  for insert with check (user_id = auth.uid());
create policy "Users can update own context logs" on public.user_context_logs
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete own context logs" on public.user_context_logs
  for delete using (user_id = auth.uid());

-- Policies for user_meals
create policy "Users can view own meals" on public.user_meals
  for select using (user_id = auth.uid());
create policy "Users can insert own meals" on public.user_meals
  for insert with check (user_id = auth.uid());
create policy "Users can update own meals" on public.user_meals
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete own meals" on public.user_meals
  for delete using (user_id = auth.uid());

-- Policies for user_meal_items (via meal ownership)
create policy "Users can view own meal items" on public.user_meal_items
  for select using (
    meal_id in (
      select id from public.user_meals where user_id = auth.uid()
    )
  );
create policy "Users can insert own meal items" on public.user_meal_items
  for insert with check (
    meal_id in (
      select id from public.user_meals where user_id = auth.uid()
    )
  );
create policy "Users can update own meal items" on public.user_meal_items
  for update using (
    meal_id in (
      select id from public.user_meals where user_id = auth.uid()
    )
  );
create policy "Users can delete own meal items" on public.user_meal_items
  for delete using (
    meal_id in (
      select id from public.user_meals where user_id = auth.uid()
    )
  );

-- Policies for symptom_logs
create policy "Users can view own symptom logs" on public.symptom_logs
  for select using (user_id = auth.uid());
create policy "Users can insert own symptom logs" on public.symptom_logs
  for insert with check (user_id = auth.uid());
create policy "Users can update own symptom logs" on public.symptom_logs
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete own symptom logs" on public.symptom_logs
  for delete using (user_id = auth.uid());

-- Policies for user_daily_rollups
create policy "Users can view own daily rollups" on public.user_daily_rollups
  for select using (user_id = auth.uid());
create policy "Users can insert own daily rollups" on public.user_daily_rollups
  for insert with check (user_id = auth.uid());
create policy "Users can update own daily rollups" on public.user_daily_rollups
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete own daily rollups" on public.user_daily_rollups
  for delete using (user_id = auth.uid());

-- Public tables (read-only for authenticated users)
alter table public.foods enable row level security;
alter table public.handling_modifiers enable row level security;

create policy "Anyone can read foods" on public.foods
  for select using (true);
create policy "Anyone can read handling modifiers" on public.handling_modifiers
  for select using (true);