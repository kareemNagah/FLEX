from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# Import routers
from views.ai_planner_view import router as ai_planner_router
from views.auth_router import router as auth_router

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="FLEX API",
    description="FastAPI backend for FLEX application with LangChain integration",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai_planner_router, prefix="/api", tags=["AI Planner"])
app.include_router(auth_router, prefix="/api", tags=["Authentication"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to FLEX API"}

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)