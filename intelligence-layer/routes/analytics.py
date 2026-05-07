from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import pandas as pd
import numpy as np
from collections import defaultdict
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Sample data generation (in production, this would come from databases)
def generate_sample_user_data() -> pd.DataFrame:
    """Generate sample user activity data"""
    np.random.seed(42)
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    
    data = []
    for date in dates:
        # Simulate user activity
        active_users = np.random.poisson(50) + 10
        new_users = np.random.poisson(5) + 1
        page_views = np.random.poisson(200) + 50
        
        data.append({
            'date': date,
            'active_users': active_users,
            'new_users': new_users,
            'page_views': page_views,
            'sessions': active_users * np.random.uniform(1.5, 3.0)
        })
    
    return pd.DataFrame(data)

def generate_sample_content_data() -> pd.DataFrame:
    """Generate sample content performance data"""
    categories = ['Technology', 'Business', 'Design', 'Marketing', 'Strategy']
    
    data = []
    for i in range(100):
        data.append({
            'content_id': f"content_{i}",
            'category': np.random.choice(categories),
            'views': np.random.poisson(100) + 10,
            'engagement_time': np.random.exponential(300) + 60,  # seconds
            'likes': np.random.poisson(20) + 1,
            'shares': np.random.poisson(5) + 1,
            'created_at': datetime.now() - timedelta(days=np.random.randint(0, 365))
        })
    
    return pd.DataFrame(data)

class AnalyticsResponse(BaseModel):
    period: str
    metrics: Dict[str, Any]
    trends: Dict[str, List[float]]
    insights: List[str]

class UserAnalytics(BaseModel):
    total_users: int
    active_users: int
    new_users: int
    retention_rate: float
    avg_session_duration: float

class ContentAnalytics(BaseModel):
    total_content: int
    avg_views: float
    top_categories: List[Dict[str, Any]]
    engagement_rate: float

@router.get("/overview", response_model=AnalyticsResponse)
async def get_analytics_overview(
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    user_id: Optional[str] = Query(None, description="Filter by specific user")
):
    """Get comprehensive analytics overview"""
    try:
        # Generate sample data
        user_data = generate_sample_user_data()
        content_data = generate_sample_content_data()
        
        # Filter by date range if provided
        if date_from:
            user_data = user_data[user_data['date'] >= date_from]
        if date_to:
            user_data = user_data[user_data['date'] <= date_to]
        
        # Calculate metrics
        total_users = user_data['active_users'].sum()
        total_new_users = user_data['new_users'].sum()
        total_page_views = user_data['page_views'].sum()
        avg_session_duration = user_data['sessions'].mean() * 120  # Convert to seconds
        
        # Calculate trends (last 30 days)
        recent_data = user_data.tail(30)
        user_trend = recent_data['active_users'].tolist()
        page_view_trend = recent_data['page_views'].tolist()
        
        # Generate insights
        insights = []
        if user_trend[-1] > user_trend[0]:
            insights.append("User activity is trending upward")
        else:
            insights.append("User activity needs attention")
        
        if total_page_views / total_users > 4:
            insights.append("High engagement per user")
        else:
            insights.append("Consider improving content to increase engagement")
        
        return AnalyticsResponse(
            period=f"{date_from or 'all time'} to {date_to or 'present'}",
            metrics={
                "total_users": int(total_users),
                "new_users": int(total_new_users),
                "total_page_views": int(total_page_views),
                "avg_session_duration": round(avg_session_duration, 2),
                "content_pieces": len(content_data)
            },
            trends={
                "users": user_trend,
                "page_views": page_view_trend
            },
            insights=insights
        )
        
    except Exception as e:
        logger.error(f"Failed to generate analytics overview: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate analytics")

@router.get("/users", response_model=UserAnalytics)
async def get_user_analytics(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    """Get user-specific analytics"""
    try:
        user_data = generate_sample_user_data()
        
        # Filter by date range
        if date_from:
            user_data = user_data[user_data['date'] >= date_from]
        if date_to:
            user_data = user_data[user_data['date'] <= date_to]
        
        # Calculate metrics
        total_active_users = user_data['active_users'].sum()
        total_new_users = user_data['new_users'].sum()
        
        # Simulate retention rate
        retention_rate = min(0.95, 0.7 + (total_new_users / max(total_active_users, 1)) * 0.2)
        
        # Average session duration
        avg_session_duration = user_data['sessions'].mean() * 120  # Convert to seconds
        
        return UserAnalytics(
            total_users=total_active_users + 1000,  # Include historical users
            active_users=int(total_active_users),
            new_users=int(total_new_users),
            retention_rate=round(retention_rate, 3),
            avg_session_duration=round(avg_session_duration, 2)
        )
        
    except Exception as e:
        logger.error(f"Failed to generate user analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate user analytics")

@router.get("/content", response_model=ContentAnalytics)
async def get_content_analytics():
    """Get content performance analytics"""
    try:
        content_data = generate_sample_content_data()
        
        # Calculate metrics
        total_content = len(content_data)
        avg_views = content_data['views'].mean()
        
        # Top categories
        category_stats = content_data.groupby('category').agg({
            'views': 'sum',
            'engagement_time': 'mean',
            'likes': 'sum'
        }).reset_index()
        
        category_stats['engagement_rate'] = (
            (category_stats['likes'] + category_stats['views'] * 0.1) / 
            category_stats['views'] * 100
        )
        
        top_categories = category_stats.nlargest(5, 'views').to_dict('records')
        
        # Overall engagement rate
        total_engagement = (content_data['likes'] + content_data['shares']).sum()
        total_views = content_data['views'].sum()
        engagement_rate = (total_engagement / total_views * 100) if total_views > 0 else 0
        
        return ContentAnalytics(
            total_content=total_content,
            avg_views=round(avg_views, 2),
            top_categories=[{
                "category": cat["category"],
                "views": int(cat["views"]),
                "engagement_rate": round(cat["engagement_rate"], 2)
            } for cat in top_categories],
            engagement_rate=round(engagement_rate, 2)
        )
        
    except Exception as e:
        logger.error(f"Failed to generate content analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content analytics")

@router.get("/predictions")
async def get_analytics_predictions():
    """Get ML-based predictions and forecasts"""
    try:
        user_data = generate_sample_user_data()
        
        # Simple linear regression for prediction
        recent_data = user_data.tail(30)
        x = np.arange(len(recent_data))
        y = recent_data['active_users'].values
        
        # Calculate trend
        slope = np.polyfit(x, y, 1)[0]
        
        # Predict next 7 days
        predictions = []
        for i in range(1, 8):
            predicted_value = y[-1] + slope * i
            predictions.append(max(0, int(predicted_value)))
        
        return {
            "predictions": {
                "next_7_days_active_users": predictions,
                "trend": "increasing" if slope > 0 else "decreasing",
                "confidence": round(abs(slope) / y.mean() * 100, 2) if y.mean() > 0 else 0
            },
            "recommendations": [
                "Focus on user retention strategies" if slope < 0 else "Maintain current growth strategy",
                "Optimize content for peak engagement hours",
                "Consider A/B testing new features"
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to generate predictions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate predictions")
