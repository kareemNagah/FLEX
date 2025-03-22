from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ScheduleItem(BaseModel):
    """Model for a single schedule item"""
    id: str
    time: str
    activity: str
    duration: int
    priority: str  # 'high', 'medium', 'low'

class UserPreferences(BaseModel):
    """Model for user preferences for daily planning"""
    wakeUpTime: str
    sleepTime: str
    focusPeriods: int
    breakDuration: int
    primaryGoal: str

class AIGeneratedPlan(BaseModel):
    """Model for AI generated daily plan"""
    dailySchedule: List[ScheduleItem]
    weeklyFocus: List[str]
    suggestedHabits: List[str]
    id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None

class AIGeneratedPlanResponse(BaseModel):
    """Model for AI generated plan response"""
    plan: AIGeneratedPlan
    message: Optional[str] = None