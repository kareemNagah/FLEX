from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from models.ai_planner import WorkoutPlan, Exercise, WorkoutDay
from typing import List, Optional
from datetime import datetime
from config import settings

# MongoDB Setup
client = AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.mongodb_db_name]

# Define collections
workout_plans_collection = db["workout_plans"]
users_collection = db["users"]

# Utility functions for MongoDB
async def save_workout_plan(workout_plan: WorkoutPlan) -> str:
    """Save a workout plan to the database."""
    workout_plan_dict = workout_plan.dict(exclude={"id"})
    workout_plan_dict["created_at"] = datetime.now()
    result = await workout_plans_collection.insert_one(workout_plan_dict)
    return str(result.inserted_id)

async def get_workout_plan(plan_id: str) -> Optional[dict]:
    """Retrieve a workout plan by ID."""
    plan = await workout_plans_collection.find_one({"_id": ObjectId(plan_id)})
    if plan:
        plan["id"] = str(plan["_id"])  # Convert ObjectId to string
    return plan

async def get_user_workout_plans(user_id: str) -> List[dict]:
    """Retrieve all workout plans for a user."""
    plans = await workout_plans_collection.find({"user_id": user_id}).to_list(None)
    for plan in plans:
        plan["id"] = str(plan["_id"])  # Convert ObjectId to string
    return plans

async def delete_workout_plan(plan_id: str) -> bool:
    """Delete a workout plan by ID."""
    result = await workout_plans_collection.delete_one({"_id": ObjectId(plan_id)})
    return result.deleted_count > 0
