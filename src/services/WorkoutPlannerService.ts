import { ApiService } from './ApiService';
import { WorkoutPlanRequest, WorkoutPlan, WorkoutPlanResponse } from '../models/AIPlanner';

export const WorkoutPlannerService = {
  generateWorkoutPlan: async (request: WorkoutPlanRequest): Promise<WorkoutPlanResponse> => {
    try {
      return await ApiService.post<WorkoutPlanResponse>('/ai-planner/generate', request);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw error;
    }
  },

  getWorkoutPlan: async (planId: string): Promise<WorkoutPlan> => {
    try {
      return await ApiService.get<WorkoutPlan>(`/ai-planner/plan/${planId}`);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      throw error;
    }
  },

  updateWorkoutPlan: async (planId: string, plan: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
    try {
      return await ApiService.put<WorkoutPlan>(`/ai-planner/plan/${planId}`, plan);
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  }
};