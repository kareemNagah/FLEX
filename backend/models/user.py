from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """Model for user registration"""
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    """Model for user response (without password)"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    created_at: Optional[datetime] = None

class User(UserResponse):
    """Complete user model with password (for internal use)"""
    password: str
    
class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str