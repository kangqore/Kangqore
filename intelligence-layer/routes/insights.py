from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import List, Optional
import uuid
import pandas as pd
import numpy as np
from textblob import TextBlob
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Models
class InsightCreate(BaseModel):
    title: str
    category: str
    content: str
    tags: Optional[str] = ""
    author_id: str
    author_name: str
    author_company: str

class InsightUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None

class Insight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    content: str
    tags: str = ""
    author_id: str
    author_name: str
    author_company: str
    views: int = 0
    published: bool = True
    sentiment_score: Optional[float] = None
    readability_score: Optional[float] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# In-memory storage (in production, use proper database)
insights_db = []

def analyze_content(content: str) -> dict:
    """Analyze content for sentiment and readability"""
    try:
        # Sentiment analysis
        blob = TextBlob(content)
        sentiment = blob.sentiment.polarity
        
        # Readability score (simplified)
        words = content.split()
        sentences = content.split('.')
        avg_words_per_sentence = len(words) / max(len(sentences), 1)
        
        # Normalize readability score (0-100, higher is more readable)
        readability = max(0, min(100, 100 - (avg_words_per_sentence - 15) * 2))
        
        return {
            "sentiment_score": round(sentiment, 3),
            "readability_score": round(readability, 1)
        }
    except Exception as e:
        logger.error(f"Content analysis failed: {e}")
        return {
            "sentiment_score": 0.0,
            "readability_score": 50.0
        }

@router.post("", response_model=Insight)
async def create_insight(insight_data: InsightCreate):
    """Create a new insight with AI analysis"""
    try:
        # Analyze content
        analysis = analyze_content(insight_data.content)
        
        insight = Insight(
            **insight_data.model_dump(),
            sentiment_score=analysis["sentiment_score"],
            readability_score=analysis["readability_score"]
        )
        
        insights_db.append(insight.model_dump())
        logger.info(f"Created insight: {insight.id}")
        return insight
        
    except Exception as e:
        logger.error(f"Failed to create insight: {e}")
        raise HTTPException(status_code=500, detail="Failed to create insight")

@router.get("", response_model=List[Insight])
async def get_insights(
    category: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
):
    """Get insights with optional filtering"""
    try:
        filtered_insights = insights_db
        
        if category:
            filtered_insights = [i for i in filtered_insights if i["category"] == category]
        
        # Sort by created_at descending
        filtered_insights.sort(key=lambda x: x["created_at"], reverse=True)
        
        # Apply pagination
        paginated_insights = filtered_insights[offset:offset + limit]
        
        return [Insight(**insight) for insight in paginated_insights]
        
    except Exception as e:
        logger.error(f"Failed to get insights: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve insights")

@router.get("/{insight_id}", response_model=Insight)
async def get_insight(insight_id: str):
    """Get a specific insight and increment views"""
    try:
        insight = next((i for i in insights_db if i["id"] == insight_id), None)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")
        
        # Increment views
        insight["views"] = insight.get("views", 0) + 1
        insight["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        return Insight(**insight)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get insight {insight_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve insight")

@router.get("/{insight_id}/analytics")
async def get_insight_analytics(insight_id: str):
    """Get detailed analytics for a specific insight"""
    try:
        insight = next((i for i in insights_db if i["id"] == insight_id), None)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")
        
        # Generate analytics
        content_length = len(insight["content"])
        word_count = len(insight["content"].split())
        
        return {
            "insight_id": insight_id,
            "content_length": content_length,
            "word_count": word_count,
            "views": insight.get("views", 0),
            "sentiment_score": insight.get("sentiment_score", 0),
            "readability_score": insight.get("readability_score", 0),
            "engagement_score": min(100, insight.get("views", 0) * 2 + insight.get("readability_score", 0)),
            "category_performance": len([i for i in insights_db if i["category"] == insight["category"]])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get analytics for insight {insight_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")

@router.delete("/{insight_id}")
async def delete_insight(insight_id: str):
    """Delete an insight"""
    try:
        global insights_db
        original_length = len(insights_db)
        insights_db = [i for i in insights_db if i["id"] != insight_id]
        
        if len(insights_db) == original_length:
            raise HTTPException(status_code=404, detail="Insight not found")
        
        logger.info(f"Deleted insight: {insight_id}")
        return {"message": "Insight deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete insight {insight_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete insight")
