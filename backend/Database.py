from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging
from fastapi import HTTPException, status

# MongoDB Configuration
class MongoDBConfig:
    """Configuration for MongoDB connection."""
    def __init__(self, 
                 mongodb_url: str = "mongodb://localhost:27017", 
                 db_name: str = "flex_db"):
        self.mongodb_url = mongodb_url
        self.db_name = db_name
        self.client = None
        self.db = None
        
    async def connect(self):
        """Connect to MongoDB."""
        try:
            self.client = AsyncIOMotorClient(self.mongodb_url)
            self.db = self.client[self.db_name]
            logging.info(f"Connected to MongoDB at {self.mongodb_url}, database: {self.db_name}")
            
            # Initialize collections
            self.workout_plans = self.db.workout_plans
            self.users = self.db.users
            self.daily_schedules = self.db.daily_schedules
            
            # Create indexes
            await self.db.workout_plans.create_index("user_id")
            await self.db.daily_schedules.create_index("user_id")
            
            return self.db
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    async def close(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            logging.info("MongoDB connection closed")

# MongoDB Models - PyMongo doesn't enforce schemas, but these help with type hints
class PyObjectId(ObjectId):
    """Custom ObjectId for Pydantic models."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# MongoDB Controllers
class MongoDBController:
    """Controller for MongoDB operations."""
    def __init__(self, db):
        self.db = db
        
    # User Operations
    async def create_user(self, user_data: dict):
        """Create a new user."""
        user_data["created_at"] = datetime.utcnow()
        result = await self.db.users.insert_one(user_data)
        return str(result.inserted_id)
    
    async def get_user(self, user_id: str):
        """Get user by ID."""
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user["id"] = str(user["_id"])
        return user
    
    async def get_user_by_username(self, username: str):
        """Get user by username."""
        user = await self.db.users.find_one({"username": username})
        if user:
            user["id"] = str(user["_id"])
        return user
    
    async def update_user(self, user_id: str, user_data: dict):
        """Update user information."""
        if not ObjectId.is_valid(user_id):
            return False
        user_data["updated_at"] = datetime.utcnow()
        result = await self.db.users.update_one(
            {"_id": ObjectId(user_id)}, 
            {"$set": user_data}
        )
        return result.modified_count > 0
    
    # Workout Plan Operations
    async def save_workout_plan(self, workout_plan: dict):
        """Save a workout plan."""
        workout_plan["created_at"] = datetime.utcnow()
        result = await self.db.workout_plans.insert_one(workout_plan)
        return str(result.inserted_id)

    async def get_workout_plan(self, plan_id: str):
        """Get workout plan by ID."""
        if not ObjectId.is_valid(plan_id):
            return None
        plan = await self.db.workout_plans.find_one({"_id": ObjectId(plan_id)})
        if plan:
            plan["id"] = str(plan["_id"])
        return plan

    async def get_user_workout_plans(self, user_id: str):
        """Get all workout plans for a user."""
        cursor = self.db.workout_plans.find({"user_id": user_id})
        plans = await cursor.to_list(length=100)
        for plan in plans:
            plan["id"] = str(plan["_id"])
        return plans

    async def update_workout_plan(self, plan_id: str, plan_data: dict):
        """Update a workout plan."""
        if not ObjectId.is_valid(plan_id):
            return False
        plan_data["updated_at"] = datetime.utcnow()
        result = await self.db.workout_plans.update_one(
            {"_id": ObjectId(plan_id)}, 
            {"$set": plan_data}
        )
        return result.modified_count > 0

    async def delete_workout_plan(self, plan_id: str):
        """Delete a workout plan."""
        if not ObjectId.is_valid(plan_id):
            return False
        result = await self.db.workout_plans.delete_one({"_id": ObjectId(plan_id)})
        return result.deleted_count > 0
    
    # Daily Schedule Operations
    async def save_daily_schedule(self, schedule: dict):
        """Save a daily schedule."""
        schedule["created_at"] = datetime.utcnow()
        result = await self.db.daily_schedules.insert_one(schedule)
        return str(result.inserted_id)
    
    async def get_daily_schedule(self, schedule_id: str):
        """Get daily schedule by ID."""
        if not ObjectId.is_valid(schedule_id):
            return None
        schedule = await self.db.daily_schedules.find_one({"_id": ObjectId(schedule_id)})
        if schedule:
            schedule["id"] = str(schedule["_id"])
        return schedule
    
    async def get_user_daily_schedules(self, user_id: str):
        """Get all daily schedules for a user."""
        cursor = self.db.daily_schedules.find({"user_id": user_id})
        schedules = await cursor.to_list(length=100)
        for schedule in schedules:
            schedule["id"] = str(schedule["_id"])
        return schedules
    
    async def update_daily_schedule(self, schedule_id: str, schedule_data: dict):
        """Update a daily schedule."""
        if not ObjectId.is_valid(schedule_id):
            return False
        schedule_data["updated_at"] = datetime.utcnow()
        result = await self.db.daily_schedules.update_one(
            {"_id": ObjectId(schedule_id)}, 
            {"$set": schedule_data}
        )
        return result.modified_count > 0
    
    async def delete_daily_schedule(self, schedule_id: str):
        """Delete a daily schedule."""
        if not ObjectId.is_valid(schedule_id):
            return False
        result = await self.db.daily_schedules.delete_one({"_id": ObjectId(schedule_id)})
        return result.deleted_count > 0


# Usage example
async def initialize_mongodb(mongodb_url: str, db_name: str) -> MongoDBController:
    """Initialize MongoDB connection and return controller."""
    mongo_config = MongoDBConfig(mongodb_url, db_name)
    db = await mongo_config.connect()
    return MongoDBController(db)
