-- Create tables for histamine calculator
-- All tables have user_id uuid where relevant and created_at timestamptz default now()

-- foods: global catalogue
create table public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  base_mg_per_kg numeric,          -- null if banded
  band text check (band in ('low','medium','high','very_high')),
  liberator boolean default false,
  dao_blocker boolean default false,
  typical_serve_g int,
  confidence text check (confidence in ('low','medium','high')) default 'medium',
  notes text,
  created_at timestamptz default now()
);

-- handling modifiers
create table public.handling_modifiers (
  id uuid primary key default gen_random_uuid(),
  label text unique not null,
  multiplier numeric not null check (multiplier > 0),
  created_at timestamptz default now()
);

-- user profile
create table public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sex text check (sex in ('female','male','other')),
  cycle_tracking boolean default false,
  default_tolerance_hu numeric default 100,
  created_at timestamptz default now()
);

-- context logs per day
create table public.user_context_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  sleep_score int check (sleep_score between 0 and 100),
  stress_level int check (stress_level between 0 and 10),
  illness boolean default false,
  alcohol boolean default false,
  dao_units_kU int default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- meals and items
create table public.user_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null,
  context_id uuid references public.user_context_logs(id),
  hu_meal numeric default 0,
  created_at timestamptz default now()
);

create table public.user_meal_items (
  meal_id uuid not null references public.user_meals(id) on delete cascade,
  idx int not null,
  food_id uuid not null references public.foods(id),
  grams numeric not null check (grams >= 0),
  handling_id uuid references public.handling_modifiers(id),
  computed_hu numeric not null default 0,
  created_at timestamptz default now(),
  primary key (meal_id, idx)
);

-- symptoms
create table public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  severity int not null check (severity between 0 and 10),
  lag_bucket text check (lag_bucket in ('immediate','2-6h','6-24h')),
  notes text,
  created_at timestamptz default now()
);

-- daily rollup and tolerance
create table public.user_daily_rollups (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  total_hu numeric not null default 0,
  tolerance_before numeric not null,
  tolerance_after numeric not null,
  created_at timestamptz default now(),
  primary key (user_id, date)
);

-- Indexes for performance
create index idx_foods_name on public.foods using gin(to_tsvector('english', name));
create index idx_foods_category on public.foods(category);
create index idx_user_meals_user_occurred on public.user_meals(user_id, occurred_at desc);
create index idx_user_context_logs_user_date on public.user_context_logs(user_id, date);
create index idx_symptom_logs_user_date on public.symptom_logs(user_id, date);
create index idx_user_daily_rollups_user_date on public.user_daily_rollups(user_id, date desc);