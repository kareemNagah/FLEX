import os
from typing import Dict, Any, List, Optional
from models.ai_planner import WorkoutPlanRequest, WorkoutPlan, Exercise, WorkoutDay
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from datetime import datetime
import json
import uuid

# Get OpenAI API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Mock database for workout plans (replace with actual database in production)
workout_plans_db = {}

class AIPlannerController:
    @staticmethod
    async def generate_workout_plan(request: WorkoutPlanRequest, user_id: Optional[str] = None) -> WorkoutPlan:
        """Generate a workout plan using OpenAI and LangChain"""
        # Initialize OpenAI LLM
        llm = OpenAI(temperature=0.7, model_name="gpt-3.5-turbo", api_key=OPENAI_API_KEY)
        
        # Create output parser
        parser = PydanticOutputParser(pydantic_object=WorkoutPlan)
        
        # Create prompt template
        template = """
        You are an expert fitness trainer. Create a detailed workout plan based on the following information:
        
        Fitness Level: {fitness_level}
        Goals: {goals}
        Available Equipment: {available_equipment}
        Workout Days Per Week: {workout_days_per_week}
        Time Per Session: {time_per_session} minutes
        Preferences: {preferences}
        Limitations: {limitations}
        
        The workout plan should include:
        1. A title and description
        2. A list of workout days with specific exercises
        3. For each exercise, include sets, reps, rest time, and muscle groups targeted
        
        {format_instructions}
        """
        
        # Create prompt with format instructions
        prompt = PromptTemplate(
            template=template,
            input_variables=[
                "fitness_level", "goals", "available_equipment", 
                "workout_days_per_week", "time_per_session", 
                "preferences", "limitations"
            ],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        # Create LLMChain
        chain = LLMChain(llm=llm, prompt=prompt)
        
        try:
            # Run the chain
            result = chain.run(
                fitness_level=request.fitness_level,
                goals=request.goals,
                available_equipment=request.available_equipment,
                workout_days_per_week=request.workout_days_per_week,
                time_per_session=request.time_per_session,
                preferences=request.preferences,
                limitations=request.limitations
            )
            
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
            
        except Exception as e:
            # Handle errors
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