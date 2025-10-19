import { UserContextLog, SymptomLog } from './types';

/**
 * Calculate daily tolerance update using EWMA (Exponentially Weighted Moving Average)
 * Based on the specification in the build guide
 */
export function calculateToleranceUpdate(
  currentTolerance: number,
  symptomSeverity: number, // 0-10, max across logs for the day
  context: UserContextLog | null,
  recentSymptomHistory: number[] = [] // Last 3 days of max symptom severity
): number {
  const target = 2; // Target symptom level
  const alpha = 3; // Tuning constant
  
  // Calculate context penalties
  let contextPenalty = 0;
  if (context) {
    if ((context.sleep_score || 100) < 50) contextPenalty += 5;
    if ((context.stress_level || 0) >= 7) contextPenalty += 5;
    if (context.illness) contextPenalty += 10;
    if (context.alcohol) contextPenalty += 10;
  }
  
  // Calculate streak bonus
  const streakBonus = recentSymptomHistory.length >= 3 && 
    recentSymptomHistory.every(severity => severity <= 2) ? 5 : 0;
  
  // Apply EWMA formula
  const rawUpdate = currentTolerance + alpha * (target - symptomSeverity) - contextPenalty + streakBonus;
  
  // Clamp to bounds and daily change limits
  const minTolerance = 50;
  const maxTolerance = 250;
  const maxDailyChange = 25;
  
  // Apply daily change cap
  const cappedUpdate = Math.max(
    currentTolerance - maxDailyChange,
    Math.min(currentTolerance + maxDailyChange, rawUpdate)
  );
  
  // Apply absolute bounds
  return Math.max(minTolerance, Math.min(maxTolerance, cappedUpdate));
}

/**
 * Get maximum symptom severity for a given date
 */
export function getMaxSymptomSeverity(symptoms: SymptomLog[], date: string): number {
  const daySymptoms = symptoms.filter(s => s.date === date);
  if (daySymptoms.length === 0) return 0;
  return Math.max(...daySymptoms.map(s => s.severity));
}

/**
 * Get recent symptom history for streak calculation
 */
export function getRecentSymptomHistory(
  symptoms: SymptomLog[], 
  beforeDate: string, 
  days: number = 3
): number[] {
  const date = new Date(beforeDate);
  const history: number[] = [];
  
  for (let i = 1; i <= days; i++) {
    const checkDate = new Date(date);
    checkDate.setDate(date.getDate() - i);
    const dateString = checkDate.toISOString().split('T')[0];
    
    const maxSeverity = getMaxSymptomSeverity(symptoms, dateString);
    history.unshift(maxSeverity); // Add to beginning to maintain chronological order
  }
  
  return history;
}

/**
 * Calculate tolerance trend over time
 */
export function calculateToleranceTrend(toleranceHistory: number[]): 'improving' | 'stable' | 'declining' {
  if (toleranceHistory.length < 2) return 'stable';
  
  const recent = toleranceHistory.slice(-7); // Last 7 days
  const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
  const secondHalf = recent.slice(Math.floor(recent.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const change = secondAvg - firstAvg;
  
  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
}