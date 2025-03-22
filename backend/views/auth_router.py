from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from views.auth_view import AuthController, Token
from typing import Annotated

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """Endpoint to authenticate user and get JWT token"""
    from views.auth_view import fake_users_db
    user = AuthController.authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    from datetime import timedelta
    access_token_expires = timedelta(minutes=30)
    access_token = AuthController.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}