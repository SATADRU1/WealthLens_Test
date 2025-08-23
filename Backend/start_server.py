#!/usr/bin/env python3
"""
Start script for WealthLens Backend Server
"""
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    print("🚀 Starting WealthLens Backend Server...")
    print("📍 Backend will be available at: http://localhost:8000")
    print("🌐 Health check: http://localhost:8000/health")
    print("💬 API endpoint: http://localhost:8000/query")
    print("=" * 50)
    
    # Start the server
    uvicorn.run(
        "run:app",
        host="0.0.0.0",  # Allow external connections (important for mobile)
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
