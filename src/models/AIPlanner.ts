
// Original productivity planner interfaces (keeping for backward compatibility)
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

// Workout planner interfaces (matching backend models)
export interface WorkoutPlanRequest {
  fitness_level: string;
  goals: string[];
  available_equipment?: string[];
  workout_days_per_week: number;
  time_per_session: number;
  preferences?: string[];
  limitations?: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_time: string;
  description?: string;
  equipment?: string[];
  muscle_groups: string[];
  difficulty: string;
  instructions?: string;
  alternatives?: string[];
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  warm_up?: string;
  cool_down?: string;
  total_time?: number;
}

export interface WorkoutPlan {
  id?: string;
  user_id?: string;
  title: string;
  description: string;
  fitness_level: string;
  goals: string[];
  workout_days: WorkoutDay[];
  created_at?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface WorkoutPlanResponse {
  plan: WorkoutPlan;
  message?: string;
}
