
export interface UserPreferences {
  wakeUpTime: string;
  sleepTime: string;
  focusPeriods: number;
  breakDuration: number;
  primaryGoal: string;
}

export interface AIGeneratedPlan {
  dailySchedule: ScheduleItem[];
  weeklyFocus: string[];
  suggestedHabits: string[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
}
