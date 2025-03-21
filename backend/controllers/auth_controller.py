from models.user import UserCreate, UserResponse, User
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from fastapi import HTTPException, status

# Get JWT settings from environment variables
JWT_SECRET = os.getenv("JWT_SECRET", "default_secret_key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock database for users (replace with actual database in production)
users_db = {}

class AuthController:
    @staticmethod
    async def register_user(user_create: UserCreate) -> UserResponse:
        """Register a new user"""
        # Check if username already exists
        if user_create.username in users_db:
            raise ValueError("Username already registered")
        
        # Hash the password
        hashed_password = pwd_context.hash(user_create.password)
        
        # Create user object
        user = User(
            username=user_create.username,
            email=user_create.email,
            full_name=user_create.full_name,
            password=hashed_password,
            created_at=datetime.now()
        )
        
        # Save user to database
        users_db[user.username] = user
        
        # Return user response (without password)
        return UserResponse(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            created_at=user.created_at
        )
    
    @staticmethod
    async def authenticate_user(username: str, password: str) -> User:
        """Authenticate a user"""
        # Get user from database
        user = users_db.get(username)
        if not user:
            return None
        
        # Verify password
        if not pwd_context.verify(password, user.password):
            return None
        
        return user
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
        """Create a new JWT token"""
        to_encode = data.copy()
        
        # Set expiration time
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        
        # Create JWT token
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    async def get_current_user(token: str) -> UserResponse:
        """Get current user from JWT token"""
        # Define credential exception
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            # Decode JWT token
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            username: str = payload.get("sub")
            
            if username is None:
                raise credentials_exception
            
            # Get user from database
            user = users_db.get(username)
            if user is None:
                raise credentials_exception
            
            # Return user response (without password)
            return UserResponse(
                username=user.username,
                email=user.email,
                full_name=user.full_name,
                created_at=user.created_at
            )
            
        except JWTError:
            raise credentials_exception