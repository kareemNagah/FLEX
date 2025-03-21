from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class WorkoutPlanRequest(BaseModel):
    """Model for workout plan request"""
    fitness_level: str = Field(..., description="User's fitness level (beginner, intermediate, advanced)")
    goals: List[str] = Field(..., description="User's fitness goals")
    available_equipment: Optional[List[str]] = Field(default=[], description="Available equipment for workouts")
    workout_days_per_week: int = Field(..., description="Number of days per week available for workouts")
    time_per_session: int = Field(..., description="Available time per workout session in minutes")
    preferences: Optional[List[str]] = Field(default=[], description="User's workout preferences")
    limitations: Optional[List[str]] = Field(default=[], description="User's physical limitations or injuries")

class Exercise(BaseModel):
    """Model for a single exercise"""
    name: str
    sets: int
    reps: str  # Can be a range like "8-12" or specific like "10"
    rest_time: str  # In seconds, e.g., "60s"
    description: Optional[str] = None
    equipment: Optional[List[str]] = None
    muscle_groups: List[str]
    difficulty: str  # beginner, intermediate, advanced
    instructions: Optional[str] = None
    alternatives: Optional[List[str]] = None

class WorkoutDay(BaseModel):
    """Model for a single workout day"""
    day: str  # e.g., "Day 1", "Monday", etc.
    focus: str  # e.g., "Upper Body", "Legs", "Full Body", etc.
    exercises: List[Exercise]
    warm_up: Optional[str] = None
    cool_down: Optional[str] = None
    total_time: Optional[int] = None  # Estimated time in minutes

class WorkoutPlan(BaseModel):
    """Model for a complete workout plan"""
    id: Optional[str] = None
    user_id: Optional[str] = None
    title: str
    description: str
    fitness_level: str
    goals: List[str]
    workout_days: List[WorkoutDay]
    created_at: Optional[datetime] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class WorkoutPlanResponse(BaseModel):
    """Model for workout plan response"""
    plan: WorkoutPlan
    message: Optional[str] = None