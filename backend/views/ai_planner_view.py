from fastapi import APIRouter, Depends, HTTPException, status
from models.ai_planner import WorkoutPlanRequest, WorkoutPlan, WorkoutPlanResponse
from controllers.ai_planner_controller import AIPlannerController
from views.auth_view import oauth2_scheme, AuthController
from typing import List

router = APIRouter(prefix="/ai-planner", tags=["AI Planner"])

@router.post("/generate", response_model=WorkoutPlanResponse)
async def generate_workout_plan(request: WorkoutPlanRequest, token: str = Depends(oauth2_scheme)):
    """Generate a workout plan using AI"""
    try:
        # Get current user
        user = await AuthController.get_current_user(token)
        
        # Generate workout plan
        workout_plan = await AIPlannerController.generate_workout_plan(request, user.username)
        
        return WorkoutPlanResponse(
            plan=workout_plan,
            message="Workout plan generated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating workout plan: {str(e)}"
        )

@router.get("/plans", response_model=List[WorkoutPlan])
async def get_user_workout_plans(token: str = Depends(oauth2_scheme)):
    """Get all workout plans for the current user"""
    try:
        # Get current user
        user = await AuthController.get_current_user(token)
        
        # Get user's workout plans
        workout_plans = await AIPlannerController.get_user_workout_plans(user.username)
        
        return workout_plans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving workout plans: {str(e)}"
        )

@router.get("/plans/{plan_id}", response_model=WorkoutPlan)
async def get_workout_plan(plan_id: str, token: str = Depends(oauth2_scheme)):
    """Get a specific workout plan by ID"""
    try:
        # Get current user
        user = await AuthController.get_current_user(token)
        
        # Get workout plan
        workout_plan = await AIPlannerController.get_workout_plan(plan_id)
        
        if not workout_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workout plan not found"
            )
        
        # Check if the workout plan belongs to the user
        if workout_plan.user_id != user.username:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this workout plan"
            )
        
        return workout_plan
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving workout plan: {str(e)}"
        )

@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workout_plan(plan_id: str, token: str = Depends(oauth2_scheme)):
    """Delete a workout plan"""
    try:
        # Get current user
        user = await AuthController.get_current_user(token)
        
        # Get workout plan
        workout_plan = await AIPlannerController.get_workout_plan(plan_id)
        
        if not workout_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workout plan not found"
            )
        
        # Check if the workout plan belongs to the user
        if workout_plan.user_id != user.username:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this workout plan"
            )
        
        # Delete workout plan
        success = await AIPlannerController.delete_workout_plan(plan_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete workout plan"
            )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting workout plan: {str(e)}"
        )