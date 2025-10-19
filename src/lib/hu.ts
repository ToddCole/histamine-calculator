import { Food, HandlingModifier } from './types';

/**
 * Maps histamine bands to mg per typical serve
 */
export function bandToMgPerServe(band: 'low' | 'medium' | 'high' | 'very_high'): number {
  return { 
    low: 0.2, 
    medium: 1.0, 
    high: 4.0, 
    very_high: 10.0 
  }[band];
}

/**
 * Calculate Histamine Units for a single food item
 * Core formula: HU_item = (base_mg_per_kg * grams / 1000) * handling_mult * liberator_mult * dao_blocker_mult
 */
export function huItem(
  base_mg_per_kg: number | null,
  band: 'low' | 'medium' | 'high' | 'very_high' | null,
  grams: number,
  typical_serve_g: number | null,
  handling_mult: number,
  liberator: boolean,
  dao_blocker: boolean,
  alcohol_with_meal: boolean
): number {
  const liberatorMult = liberator ? 1.2 : 1.0;
  const blockerMult = (dao_blocker || alcohol_with_meal) ? 1.3 : 1.0;
  
  let mg = 0;
  
  // Use measured base_mg_per_kg when present
  if (base_mg_per_kg != null) {
    mg = base_mg_per_kg * grams / 1000;
  } 
  // Otherwise map bands and scale by portion
  else if (band && typical_serve_g) {
    mg = bandToMgPerServe(band) * (grams / typical_serve_g);
  }
  
  return mg * handling_mult * liberatorMult * blockerMult;
}

/**
 * Calculate DAO credit for a meal
 * Subtract min(0.3 * dao_units_kU, 0.3 * meal_subtotal_HU), cap at 30 percent of that meal
 */
export function daoCredit(mealHU: number, daoUnits: number): number {
  const theoretical = 0.3 * daoUnits;
  const cap = 0.3 * mealHU;
  return Math.min(theoretical, cap);
}

/**
 * Calculate total HU for a meal including all modifiers and DAO credit
 */
export function calculateMealHU(
  items: Array<{
    food: Food;
    grams: number;
    handling: HandlingModifier | null;
  }>,
  alcohol_with_meal: boolean = false,
  dao_units_kU: number = 0
): { items: number[]; subtotal: number; dao_credit: number; total: number } {
  const itemHUs = items.map(item => 
    huItem(
      item.food.base_mg_per_kg || null,
      item.food.band || null,
      item.grams,
      item.food.typical_serve_g || null,
      item.handling?.multiplier || 1.0,
      item.food.liberator,
      item.food.dao_blocker,
      alcohol_with_meal
    )
  );
  
  const subtotal = itemHUs.reduce((sum, hu) => sum + hu, 0);
  const credit = daoCredit(subtotal, dao_units_kU);
  const total = Math.max(0, subtotal - credit);
  
  return {
    items: itemHUs,
    subtotal,
    dao_credit: credit,
    total
  };
}

/**
 * Determine gauge color based on HU vs tolerance
 */
export function getGaugeColor(totalHU: number, tolerance: number): 'green' | 'amber' | 'red' {
  const ratio = totalHU / tolerance;
  
  if (ratio <= 0.7) return 'green';
  if (ratio <= 0.9) return 'amber';
  return 'red';
}

/**
 * Format HU for display
 */
export function formatHU(hu: number): string {
  if (hu < 1) return hu.toFixed(2);
  if (hu < 10) return hu.toFixed(1);
  return Math.round(hu).toString();
}