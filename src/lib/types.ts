export type Food = {
  id: string;
  name: string;
  category?: string;
  base_mg_per_kg?: number;
  band?: 'low' | 'medium' | 'high' | 'very_high';
  liberator: boolean;
  dao_blocker: boolean;
  typical_serve_g?: number;
  confidence: 'low' | 'medium' | 'high';
  notes?: string;
};

export type HandlingModifier = {
  id: string;
  label: string;
  multiplier: number;
};

export type MealItemInput = {
  food_id: string;
  grams: number;
  handling_id: string;
};

export type MealCreateInput = {
  occurred_at: string;
  context_id?: string;
  items: MealItemInput[];
  alcohol_with_meal?: boolean;
  dao_units_kU?: number;
};

export type UserProfile = {
  user_id: string;
  sex?: 'female' | 'male' | 'other';
  cycle_tracking: boolean;
  default_tolerance_hu: number;
};

export type UserContextLog = {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  sleep_score?: number; // 0-100
  stress_level?: number; // 0-10
  illness: boolean;
  alcohol: boolean;
  dao_units_kU: number;
};

export type UserMeal = {
  id: string;
  user_id: string;
  occurred_at: string; // ISO timestamp
  context_id?: string;
  hu_meal: number;
};

export type UserMealItem = {
  meal_id: string;
  idx: number;
  food_id: string;
  grams: number;
  handling_id?: string;
  computed_hu: number;
};

export type SymptomLog = {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  severity: number; // 0-10
  lag_bucket: 'immediate' | '2-6h' | '6-24h';
  notes?: string;
};

export type UserDailyRollup = {
  user_id: string;
  date: string; // YYYY-MM-DD
  total_hu: number;
  tolerance_before: number;
  tolerance_after: number;
};

export type DayGauge = 'green' | 'amber' | 'red';

export type MealResponse = {
  meal_id: string;
  hu_meal: number;
  items: Array<{ idx: number; computed_hu: number }>;
  day_total_hu: number;
  day_gauge: DayGauge;
};

export type DayResponse = {
  total_hu: number;
  tolerance: number;
  gauge: DayGauge;
  meals: UserMeal[];
};