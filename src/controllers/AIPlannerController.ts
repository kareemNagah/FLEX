import { 
  AIGeneratedPlan, 
  UserPreferences, 
  ScheduleItem, 
  WorkoutPlanRequest, 
  WorkoutPlan, 
  WorkoutPlanResponse 
} from "../models/AIPlanner";
import { ApiService } from "../services/ApiService";

export class AIPlannerController {
  private static PRODUCTIVITY_ENDPOINT = '/ai-planner';
  private static WORKOUT_ENDPOINT = '/ai-planner/generate';
  private static useApi = true; // Set to true to use the FastAPI backend

  // Original productivity planner method (keeping for backward compatibility)
  static async generatePlan(preferences: UserPreferences): Promise<AIGeneratedPlan> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.post<AIGeneratedPlan>(this.PRODUCTIVITY_ENDPOINT, preferences);
      } else {
        // Fallback to mock data
        console.log("Generating plan based on preferences:", preferences);
        
        // Create a mock daily schedule based on preferences
        const dailySchedule: ScheduleItem[] = [
          {
            id: "1",
            time: preferences.wakeUpTime,
            activity: "Morning Routine & Breakfast",
            duration: 30,
            priority: "medium"
          },
          {
            id: "2",
            time: this.addMinutesToTime(preferences.wakeUpTime, 30),
            activity: `Focus Session: ${preferences.primaryGoal}`,
            duration: 90,
            priority: "high"
          },
          {
            id: "3",
            time: this.addMinutesToTime(preferences.wakeUpTime, 120),
            activity: "Short Break",
            duration: preferences.breakDuration,
            priority: "low"
          },
          // Add more activities based on user preferences
        ];

        // Return a complete plan
        return {
          dailySchedule,
          weeklyFocus: [
            "Complete project milestones",
            "Learn new development skills",
            "Balance work with self-care"
          ],
          suggestedHabits: [
            "Daily coding practice",
            "10-minute meditation",
            "Regular stretching breaks"
          ]
        };
      }
    } catch (error) {
      console.error('Failed to generate AI plan:', error);
      throw error;
    }
  }

  // New method for generating workout plans using Gemini API
  static async generateWorkoutPlan(request: WorkoutPlanRequest): Promise<WorkoutPlan> {
    try {
      if (this.useApi) {
        // Use the API service to call the backend
        const response = await ApiService.post<WorkoutPlanResponse>(this.WORKOUT_ENDPOINT, request);
        return response.plan;
      } else {
        // Fallback to mock data if API is not available
        console.error('API is not enabled. Please set useApi to true to use the Gemini API.');
        throw new Error('API is not enabled. Please set useApi to true to use the Gemini API.');
      }
    } catch (error) {
      // Check if the error is related to the API key
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('api key')) {
        console.error('Invalid Gemini API key. Please check your API key in the backend .env file.');
        throw new Error('Invalid Gemini API key. Please check your API key in the backend .env file.');
      } else {
        console.error('Failed to generate workout plan:', error);
        throw error;
      }
    }
  }

  // Get user's workout plans
  static async getUserWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      if (this.useApi) {
        return await ApiService.get<WorkoutPlan[]>(`${this.WORKOUT_ENDPOINT.split('/')[1]}/plans`);
      } else {
        console.error('API is not enabled. Please set useApi to true to use the backend API.');
        return [];
      }
    } catch (error) {
      console.error('Failed to get user workout plans:', error);
      throw error;
    }
  }

  // Get a specific workout plan by ID
  static async getWorkoutPlan(planId: string): Promise<WorkoutPlan> {
    try {
      if (this.useApi) {
        return await ApiService.get<WorkoutPlan>(`${this.WORKOUT_ENDPOINT.split('/')[1]}/plans/${planId}`);
      } else {
        console.error('API is not enabled. Please set useApi to true to use the backend API.');
        throw new Error('API is not enabled. Please set useApi to true to use the backend API.');
      }
    } catch (error) {
      console.error(`Failed to get workout plan with ID ${planId}:`, error);
      throw error;
    }
  }

  // Delete a workout plan
  static async deleteWorkoutPlan(planId: string): Promise<void> {
    try {
      if (this.useApi) {
        await ApiService.delete(`${this.WORKOUT_ENDPOINT.split('/')[1]}/plans/${planId}`);
      } else {
        console.error('API is not enabled. Please set useApi to true to use the backend API.');
        throw new Error('API is not enabled. Please set useApi to true to use the backend API.');
      }
    } catch (error) {
      console.error(`Failed to delete workout plan with ID ${planId}:`, error);
      throw error;
    }
  }

  static getSamplePreferences(): UserPreferences {
    return {
      wakeUpTime: "07:00",
      sleepTime: "23:00",
      focusPeriods: 4,
      breakDuration: 15,
      primaryGoal: "Complete React Project"
    };
  }

  // Sample workout plan request for testing
  static getSampleWorkoutPlanRequest(): WorkoutPlanRequest {
    return {
      fitness_level: "intermediate",
      goals: ["Build muscle", "Improve strength"],
      available_equipment: ["Dumbbells", "Barbell", "Bench"],
      workout_days_per_week: 4,
      time_per_session: 60,
      preferences: ["Compound exercises", "Progressive overload"],
      limitations: []
    };
  }

  // Helper function to add minutes to a time string
  private static addMinutesToTime(time: string, minutesToAdd: number): string {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  }
}
