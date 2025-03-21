
export interface UserProgress {
  totalTasks: number;
  completedTasks: number;
  streak: number;
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  day: string;
  completed: number;
  total: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  progress: number;
}
