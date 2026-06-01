from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from datetime import datetime
from contextlib import asynccontextmanager

from routes.insights import router as insights_router
from routes.analytics import router as analytics_router
from routes.recommendations import router as recommendations_router
from routes.chat import router as chat_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🧠 Intelligence Layer starting up...")
    yield
    logger.info("🧠 Intelligence Layer shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Kangqore Intelligence Layer",
    description="Internal AI/ML and analytics engine",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - only allow Node.js core backend
allowed_origins = [
    "http://localhost:5050",  # Node.js core backend (actual port)
    "http://localhost:3001",  # legacy / docker alias
    os.environ.get("CORE_BACKEND_URL", "http://localhost:5050"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(insights_router, prefix="/api/insights", tags=["insights"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["analytics"])
app.include_router(recommendations_router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "Intelligence Layer",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {
        "message": "Kangqore Intelligence Layer",
        "description": "Internal AI/ML and analytics engine",
        "endpoints": [
            "/api/insights",
            "/api/analytics", 
            "/api/analytics", 
            "/api/recommendations",
            "/api/chat",
            "/api/health"
            "/health"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.environ.get("ENVIRONMENT") == "development" else False
    )
