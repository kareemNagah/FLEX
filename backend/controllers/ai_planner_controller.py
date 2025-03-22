import os
from typing import Dict, Any, List, Optional
from models.ai_planner import WorkoutPlanRequest, WorkoutPlan, Exercise, WorkoutDay
from datetime import datetime
import json
import uuid
import google.generativeai as genai
import pathlib
from config import settings, GeminiModels

# Configure Google Generative AI with the API key from settings
try:
    # Validate the API key
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it in your .env file.")

    # Check if the API key has a valid format (basic check)
    if not settings.gemini_api_key.startswith("AIza"):
        raise ValueError("GEMINI_API_KEY appears to be invalid. Google API keys typically start with 'AIza'. Please check your .env file.")
    
    # Configure Gemini with the API key from settings and set API version
    genai.configure(
        api_key=settings.gemini_api_key,
        transport="rest",
        client_options={"api_endpoint": "generativelanguage.googleapis.com"}
    )
    
    # Test the API key with a simple request
    def test_gemini_api_key():
        try:
            # Use the model name from settings with correct API version
            model = genai.GenerativeModel(
                model_name=settings.gemini_model,
                generation_config={
                    "temperature": 0.9,
                    "top_p": 1,
                    "top_k": 1,
                    "max_output_tokens": 2048,
                }
            )
            response = model.generate_content("Hello, this is a test request to verify API key validity.")
            return True
        except Exception as e:
            error_message = str(e).lower()
            if "api key" in error_message or "authentication" in error_message or "unauthorized" in error_message:
                raise ValueError(f"Invalid Gemini API key: {str(e)}. Please check your API key in the .env file.")
            else:
                raise Exception(f"Error testing Gemini API: {str(e)}")
    
    # Test the API key
    test_gemini_api_key()
    
except Exception as e:
    raise ValueError(f"Failed to configure Google Generative AI: {str(e)}. Please check your API key.")


# Mock database for workout plans (replace with actual database in production)
workout_plans_db = {}

class AIPlannerController:
    @staticmethod
    async def generate_workout_plan(request: WorkoutPlanRequest, user_id: Optional[str] = None) -> WorkoutPlan:
        """Generate a workout plan using Google's Gemini API"""
        
        # Create prompt for OpenAI
        prompt = f"""
        You are an expert fitness trainer. Create a detailed workout plan based on the following information:
        
        Fitness Level: {request.fitness_level}
        Goals: {request.goals}
        Available Equipment: {request.available_equipment}
        Workout Days Per Week: {request.workout_days_per_week}
        Time Per Session: {request.time_per_session} minutes
        Preferences: {request.preferences}
        Limitations: {request.limitations}
        
        The workout plan should include:
        1. A title and description
        2. A list of workout days with specific exercises
        3. For each exercise, include sets, reps, rest time, and muscle groups targeted
        
        Return the response as a valid JSON object with the following structure:
        {{
            "title": "Title of the workout plan",
            "description": "Description of the workout plan",
            "fitness_level": "The fitness level",
            "goals": ["List", "of", "goals"],
            "workout_days": [
                {{
                    "day": "Day name (e.g., 'Day 1', 'Monday')",
                    "focus": "Focus of this workout day",
                    "exercises": [
                        {{
                            "name": "Exercise name",
                            "sets": number_of_sets,
                            "reps": "rep scheme (e.g., '10', '8-12')",
                            "rest_time": "rest time in seconds",
                            "description": "Brief description",
                            "equipment": ["Required", "equipment"],
                            "muscle_groups": ["Targeted", "muscle", "groups"],
                            "difficulty": "difficulty level",
                            "instructions": "How to perform the exercise",
                            "alternatives": ["Alternative", "exercises"]
                        }}
                    ],
                    "warm_up": "Warm-up routine",
                    "cool_down": "Cool-down routine",
                    "total_time": "Estimated total time in minutes"
                }}
            ],
            "notes": "Additional notes",
            "metadata": {{
                "any": "additional metadata"
            }}
        }}
        """
        
        try:
            # Configure Gemini model
            generation_config = {
                "temperature": 0.2,
                "response_mime_type": "application/json"
            }
            
            # Initialize Gemini model
            model = genai.GenerativeModel(
                model_name=settings.gemini_model,
                generation_config=generation_config
            )
            
            # Create system and user messages
            system_message = "You are an expert fitness trainer who creates detailed workout plans."
            full_prompt = system_message + "\n\n" + prompt
            
            # Call Gemini API
            try:
                response = model.generate_content(full_prompt)
                
                # Extract the response content
                result = response.text
            except Exception as e:
                # Check if the error is related to the API key
                error_message = str(e).lower()
                if "api key" in error_message or "authentication" in error_message or "unauthorized" in error_message:
                    raise ValueError(f"Invalid Gemini API key: {str(e)}. Please check your API key in the .env file.")
                else:
                    raise Exception(f"Error calling Gemini API: {str(e)}")
            
            # Parse the result
            workout_plan_dict = json.loads(result)
            
            # Create workout plan
            workout_plan = WorkoutPlan(
                id=str(uuid.uuid4()),
                user_id=user_id,
                title=workout_plan_dict.get("title"),
                description=workout_plan_dict.get("description"),
                fitness_level=workout_plan_dict.get("fitness_level"),
                goals=workout_plan_dict.get("goals"),
                workout_days=[
                    WorkoutDay(
                        day=day.get("day"),
                        focus=day.get("focus"),
                        exercises=[
                            Exercise(
                                name=exercise.get("name"),
                                sets=exercise.get("sets"),
                                reps=exercise.get("reps"),
                                rest_time=exercise.get("rest_time"),
                                description=exercise.get("description"),
                                equipment=exercise.get("equipment"),
                                muscle_groups=exercise.get("muscle_groups"),
                                difficulty=exercise.get("difficulty"),
                                instructions=exercise.get("instructions"),
                                alternatives=exercise.get("alternatives")
                            ) for exercise in day.get("exercises", [])
                        ],
                        warm_up=day.get("warm_up"),
                        cool_down=day.get("cool_down"),
                        total_time=day.get("total_time")
                    ) for day in workout_plan_dict.get("workout_days", [])
                ],
                created_at=datetime.now(),
                notes=workout_plan_dict.get("notes"),
                metadata=workout_plan_dict.get("metadata")
            )
            
            # Save workout plan to database
            if workout_plan.id:
                workout_plans_db[workout_plan.id] = workout_plan
            
            return workout_plan
            
        except ValueError as e:
            # Re-raise ValueError for API key issues
            raise e
        except Exception as e:
            # Handle other errors
            raise Exception(f"Error generating workout plan: {str(e)}")
    
    @staticmethod
    async def get_workout_plan(plan_id: str) -> Optional[WorkoutPlan]:
        """Get a workout plan by ID"""
        return workout_plans_db.get(plan_id)
    
    @staticmethod
    async def get_user_workout_plans(user_id: str) -> List[WorkoutPlan]:
        """Get all workout plans for a user"""
        return [plan for plan in workout_plans_db.values() if plan.user_id == user_id]
    
    @staticmethod
    async def delete_workout_plan(plan_id: str) -> bool:
        """Delete a workout plan"""
        if plan_id in workout_plans_db:
            del workout_plans_db[plan_id]
            return True
        return False