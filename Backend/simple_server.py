#!/usr/bin/env python3
"""
Simple test server for WealthLens Backend
This is a minimal server to test the frontend-backend connection.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Pydantic models
class QueryRequest(BaseModel):
    query: str
    deep_search: bool = False

class QueryResponse(BaseModel):
    answer: dict

# Create FastAPI app
app = FastAPI(
    title="WealthLens Simple Backend",
    description="Simple test backend for WealthLens",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:8000",
        "http://localhost:19006",  # Expo web
        "http://localhost:19000",  # Expo dev server
        "exp://localhost:19000",   # Expo Go app
        "exp://192.168.21.247:19000",  # Expo Go on mobile (replace with your IP)
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "WealthLens Backend is running!"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "message": "WealthLens Backend is running",
        "version": "1.0.0"
    }

@app.post("/query")
async def handle_query(request: QueryRequest):
    """
    Simple query handler for testing
    """
    try:
        # Simple mock response based on query
        query_lower = request.query.lower()
        
        if "hello" in query_lower or "hi" in query_lower:
            response_text = "Hello! I'm your AI Finance Assistant. I'm currently running in test mode. How can I help you with your financial questions?"
        elif "stock" in query_lower or "investment" in query_lower:
            response_text = "I can help you with stock and investment information! In the full version, I'll provide real-time market data and analysis."
        elif "budget" in query_lower or "saving" in query_lower:
            response_text = "Budgeting and saving are crucial for financial health. I can help you create a personalized budget plan!"
        else:
            response_text = f"Thank you for your question: '{request.query}'. I'm currently running in test mode. The full AI backend will provide detailed financial analysis and advice."
        
        # Add deep search indicator
        if request.deep_search:
            response_text += "\n\n[Deep Research Mode: This would normally provide more comprehensive analysis]"
        
        return {
            "answer": {
                "answer": response_text,
                "deep_research_log": "Test mode - no deep research performed"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/test")
async def test_endpoint():
    """Test endpoint for debugging"""
    return {
        "message": "Test endpoint working",
        "environment": {
            "python_version": "3.10+",
            "fastapi_working": True,
            "cors_enabled": True
        }
    }

if __name__ == "__main__":
    print("🚀 Starting WealthLens Simple Backend...")
    print("📍 Backend will be available at: http://localhost:8000")
    print("🌐 Health check: http://localhost:8000/health")
    print("💬 API endpoint: http://localhost:8000/query")
    print("🧪 Test endpoint: http://localhost:8000/test")
    print("=" * 50)
    
    uvicorn.run(
        "simple_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
