
import { UserProgress, Goal, WeeklyProgress } from "../models/UserProgress";

export class UserProgressController {
  // Mock data - in a real app, this would come from an API
  static getUserProgress(): UserProgress {
    return {
      totalTasks: 24,
      completedTasks: 18,
      streak: 7,
      weeklyProgress: [
        { day: "Mon", completed: 4, total: 5 },
        { day: "Tue", completed: 3, total: 4 },
        { day: "Wed", completed: 5, total: 5 },
        { day: "Thu", completed: 3, total: 5 },
        { day: "Fri", completed: 2, total: 3 },
        { day: "Sat", completed: 1, total: 2 },
        { day: "Sun", completed: 0, total: 0 }
      ]
    };
  }

  static getGoals(): Goal[] {
    return [
      {
        id: "1",
        title: "Complete React Project",
        description: "Finish the dashboard and AI agent screens for the Flex app",
        deadline: new Date(2023, 11, 15),
        progress: 75
      },
      {
        id: "2",
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals and advanced topics",
        deadline: new Date(2023, 10, 30),
        progress: 60
      },
      {
        id: "3",
        title: "Exercise Routine",
        description: "Maintain a consistent workout schedule",
        deadline: new Date(2023, 11, 31),
        progress: 40
      }
    ];
  }

  static getCompletionRate(): number {
    const progress = this.getUserProgress();
    return Math.round((progress.completedTasks / progress.totalTasks) * 100);
  }
}
