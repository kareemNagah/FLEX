from enum import Enum
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings
import os
from pathlib import Path

# Define environment variable names as Enum for consistency
class EnvVars(str, Enum):
    # API Keys
    OPENAI_API_KEY = "OPENAI_API_KEY"
    GEMINI_API_KEY = "GEMINI_API_KEY"
    
    # JWT Settings
    JWT_SECRET = "JWT_SECRET"
    JWT_ALGORITHM = "JWT_ALGORITHM"
    ACCESS_TOKEN_EXPIRE_MINUTES = "ACCESS_TOKEN_EXPIRE_MINUTES"
    
    # MongoDB Settings
    MONGODB_URL = "MONGODB_URL"
    MONGODB_DB_NAME = "MONGODB_DB_NAME"

# Define Gemini model names as Enum
class GeminiModels(str, Enum):
    # Using a currently supported model version
    GEMINI_PRO = "gemini-2.0-flash"
    

class Settings(BaseSettings):
    # API Keys
    openai_api_key: Optional[str] = Field(None, env=EnvVars.OPENAI_API_KEY)
    gemini_api_key: Optional[str] = Field(None, env=EnvVars.GEMINI_API_KEY)
    
    # JWT Settings
    jwt_secret: str = Field(..., env=EnvVars.JWT_SECRET)
    jwt_algorithm: str = Field("HS256", env=EnvVars.JWT_ALGORITHM)
    access_token_expire_minutes: int = Field(30, env=EnvVars.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # MongoDB Settings
    mongodb_url: str = Field("mongodb://localhost:27017", env=EnvVars.MONGODB_URL)
    mongodb_db_name: str = Field("flex_db", env=EnvVars.MONGODB_DB_NAME)
    
    # Gemini Model Settings
    gemini_model: str = GeminiModels.GEMINI_PRO
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Try multiple locations for .env file
        @classmethod
        def customise_sources(
            cls,
            init_settings,
            env_settings,
            file_secret_settings,
        ):
            # Define possible .env file locations
            env_file_locations = [
                Path(".env"),  # Current directory
                Path(__file__).parent / ".env",  # Same directory as this file
                Path.home() / ".env",  # User's home directory
            ]
            
            # Try to find .env file in different locations
            for env_file in env_file_locations:
                if env_file.exists():
                    return (
                        init_settings,
                        env_settings,
                        file_secret_settings,
                    )
            
            # If no .env file found, just use environment variables
            return (
                init_settings,
                env_settings,
                file_secret_settings,
            )

# Create a global settings instance
settings = Settings()