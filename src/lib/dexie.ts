import Dexie, { Table } from 'dexie';
import { Food, HandlingModifier, UserMeal, UserMealItem, UserContextLog, SymptomLog } from './types';

// Offline-first data structures
export interface PendingMeal {
  id?: number;
  temp_id: string;
  occurred_at: string;
  context_id?: string;
  items: Array<{
    food_id: string;
    grams: number;
    handling_id?: string;
  }>;
  alcohol_with_meal?: boolean;
  dao_units_kU?: number;
  created_at: Date;
  sync_attempts: number;
}

export interface PendingContext {
  id?: number;
  temp_id: string;
  date: string;
  sleep_score?: number;
  stress_level?: number;
  illness?: boolean;
  alcohol?: boolean;
  dao_units_kU?: number;
  created_at: Date;
  sync_attempts: number;
}

export interface PendingSymptom {
  id?: number;
  temp_id: string;
  date: string;
  severity: number;
  lag_bucket: 'immediate' | '2-6h' | '6-24h';
  notes?: string;
  created_at: Date;
  sync_attempts: number;
}

export class HistamineDB extends Dexie {
  // Local cached data
  foods!: Table<Food>;
  handling_modifiers!: Table<HandlingModifier>;
  
  // User data (synced)
  meals!: Table<UserMeal>;
  meal_items!: Table<UserMealItem>;
  context_logs!: Table<UserContextLog>;
  symptom_logs!: Table<SymptomLog>;
  
  // Pending sync queues
  pending_meals!: Table<PendingMeal>;
  pending_contexts!: Table<PendingContext>;
  pending_symptoms!: Table<PendingSymptom>;
  
  // App state
  app_state!: Table<{ key: string; value: unknown; updated_at: Date }>;

  constructor() {
    super('HistamineDB');
    
    this.version(1).stores({
      // Cached reference data
      foods: 'id, name, category, band, liberator, dao_blocker',
      handling_modifiers: 'id, label',
      
      // User data
      meals: 'id, user_id, occurred_at, hu_meal',
      meal_items: '[meal_id+idx], meal_id, food_id',
      context_logs: 'id, user_id, date',
      symptom_logs: 'id, user_id, date, severity',
      
      // Pending sync
      pending_meals: '++id, temp_id, occurred_at, sync_attempts',
      pending_contexts: '++id, temp_id, date, sync_attempts',
      pending_symptoms: '++id, temp_id, date, sync_attempts',
      
      // App state
      app_state: 'key'
    });
  }
}

export const db = new HistamineDB();

// Utility functions for offline operations
export async function addPendingMeal(meal: Omit<PendingMeal, 'id' | 'created_at' | 'sync_attempts'>) {
  return await db.pending_meals.add({
    ...meal,
    created_at: new Date(),
    sync_attempts: 0
  });
}

export async function addPendingContext(context: Omit<PendingContext, 'id' | 'created_at' | 'sync_attempts'>) {
  return await db.pending_contexts.add({
    ...context,
    created_at: new Date(),
    sync_attempts: 0
  });
}

export async function addPendingSymptom(symptom: Omit<PendingSymptom, 'id' | 'created_at' | 'sync_attempts'>) {
  return await db.pending_symptoms.add({
    ...symptom,
    created_at: new Date(),
    sync_attempts: 0
  });
}

export async function getPendingItems() {
  const [meals, contexts, symptoms] = await Promise.all([
    db.pending_meals.orderBy('created_at').toArray(),
    db.pending_contexts.orderBy('created_at').toArray(),
    db.pending_symptoms.orderBy('created_at').toArray()
  ]);
  
  return { meals, contexts, symptoms };
}

export async function clearPendingItem(type: 'meal' | 'context' | 'symptom', id: number) {
  switch (type) {
    case 'meal':
      return await db.pending_meals.delete(id);
    case 'context':
      return await db.pending_contexts.delete(id);
    case 'symptom':
      return await db.pending_symptoms.delete(id);
  }
}

export async function incrementSyncAttempts(type: 'meal' | 'context' | 'symptom', id: number) {
  switch (type) {
    case 'meal':
      return await db.pending_meals.update(id, { sync_attempts: (await db.pending_meals.get(id))!.sync_attempts + 1 });
    case 'context':
      return await db.pending_contexts.update(id, { sync_attempts: (await db.pending_contexts.get(id))!.sync_attempts + 1 });
    case 'symptom':
      return await db.pending_symptoms.update(id, { sync_attempts: (await db.pending_symptoms.get(id))!.sync_attempts + 1 });
  }
}

// Cache management
export async function cacheFood(food: Food) {
  return await db.foods.put(food);
}

export async function cacheFoods(foods: Food[]) {
  return await db.foods.bulkPut(foods);
}

export async function getCachedFoods(): Promise<Food[]> {
  return await db.foods.toArray();
}

export async function searchFoods(query: string): Promise<Food[]> {
  const normalizedQuery = query.toLowerCase();
  return await db.foods
    .filter(food => 
      food.name.toLowerCase().includes(normalizedQuery) ||
      (food.category?.toLowerCase().includes(normalizedQuery) || false)
    )
    .limit(50)
    .toArray();
}

export async function getHandlingModifiers(): Promise<HandlingModifier[]> {
  return await db.handling_modifiers.toArray();
}

export async function cacheHandlingModifiers(modifiers: HandlingModifier[]) {
  return await db.handling_modifiers.bulkPut(modifiers);
}