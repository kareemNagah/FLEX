from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError

# Import your models
from models.ai_planner import (
    Token, WorkoutPlanRequest, WorkoutPlan, WorkoutPlanResponse
)

# Import MongoDB setup
from mongodb import initialize_mongodb, MongoDBController
from ai_planner_controller import AIPlannerController  # Updated controller

# Import configuration
from config import settings

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Initialize FastAPI
app = FastAPI(
    title="FLEX API",
    description="FastAPI backend for FLEX application with MongoDB integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB dependency
async def get_db_controller() -> MongoDBController:
    """
    Initialize and get MongoDB controller as a dependency.
    Uses FastAPI's dependency injection system to provide the controller to routes.
    """
    mongodb_url = settings.mongodb_url
    mongodb_db_name = settings.mongodb_db_name
    
    controller = await initialize_mongodb(mongodb_url, mongodb_db_name)
    yield controller

# AI Planner controller dependency
async def get_ai_planner_controller(db: MongoDBController = Depends(get_db_controller)) -> AIPlannerController:
    """Get an initialized AI Planner controller with MongoDB access"""
    return AIPlannerController(db)

# Authentication utilities
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Verify JWT token and return user info"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.jwt_secret, 
            algorithms=[settings.jwt_algorithm]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return {"username": username}
    except JWTError:
        raise credentials_exception

# Routers
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
ai_planner_router = APIRouter(prefix="/ai-planner", tags=["AI Planner"])

# Authentication endpoints
@auth_router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: MongoDBController = Depends(get_db_controller)
):
    """Login endpoint that returns a JWT token"""
    # Get user from database
    user = await db.get_user_by_username(form_data.username)
    
    if not user or user.get("password") != form_data.password:  # Replace with proper password verification
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt

# AI Planner endpoints
@ai_planner_router.post("/generate", response_model=WorkoutPlanResponse)
async def generate_workout_plan(
    request: WorkoutPlanRequest,
    current_user: dict = Depends(get_current_user),
    ai_controller: AIPlannerController = Depends(get_ai_planner_controller)
):
    """Generate a workout plan using AI"""
    try:
        user_id = current_user["username"]
        workout_plan = await ai_controller.generate_workout_plan(request, user_id)
        return WorkoutPlanResponse(plan=workout_plan, message="Workout plan generated successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating workout plan: {str(e)}"
        )

@ai_planner_router.get("/plans", response_model=List[WorkoutPlan])
async def get_user_workout_plans(
    current_user: dict = Depends(get_current_user),
    ai_controller: AIPlannerController = Depends(get_ai_planner_controller)
):
    """Get all workout plans for the current user"""
    try:
        user_id = current_user["username"]
        plans = await ai_controller.get_user_workout_plans(user_id)
        return plans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving workout plans: {str(e)}"
        )

@ai_planner_router.get("/plans/{plan_id}", response_model=WorkoutPlan)
async def get_workout_plan(
    plan_id: str,
    current_user: dict = Depends(get_current_user),
    ai_controller: AIPlannerController = Depends(get_ai_planner_controller)
):
    """Get a specific workout plan by ID"""
    try:
        user_id = current_user["username"]
        plan = await ai_controller.get_workout_plan(plan_id)
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workout plan not found"
            )
            
        # Check if the plan belongs to the user
        if plan.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this workout plan"
            )
            
        return plan
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving workout plan: {str(e)}"
        )

@ai_planner_router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workout_plan(
    plan_id: str,
    current_user: dict = Depends(get_current_user),
    ai_controller: AIPlannerController = Depends(get_ai_planner_controller)
):
    """Delete a workout plan"""
    try:
        user_id = current_user["username"]
        
        # Get the plan to check ownership
        plan = await ai_controller.get_workout_plan(plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workout plan not found"
            )
            
        # Check if the plan belongs to the user
        if plan.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this workout plan"
            )
        
        deleted = await ai_controller.delete_workout_plan(plan_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workout plan not found or already deleted"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting workout plan: {str(e)}"
        )

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(ai_planner_router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to FLEX API"}

# Startup and shutdown events
mongodb_config = None

@app.on_event("startup")
async def startup_db_client():
    """Initialize MongoDB on application startup"""
    print("Connecting to MongoDB...")
    # The actual connection is handled by the dependency injection system
    # This is just for any additional startup tasks

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on application shutdown"""
    print("Disconnecting from MongoDB...")
    # Proper cleanup will be handled by the dependency injection system

# Run the app
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)