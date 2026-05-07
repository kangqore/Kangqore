from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Sample data (in production, this would come from databases)
class RecommendationRequest(BaseModel):
    user_id: str
    user_preferences: Optional[Dict[str, Any]] = None
    limit: int = 10

class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[Dict[str, Any]]
    algorithm: str
    confidence_scores: List[float]

class ContentRecommendation(BaseModel):
    content_id: str
    title: str
    category: str
    score: float
    reason: str

def generate_sample_content() -> pd.DataFrame:
    """Generate sample content for recommendations"""
    np.random.seed(42)
    
    content_data = [
        {
            'content_id': f"content_{i}",
            'title': f"Article {i}: {'AI' if i % 3 == 0 else 'Business' if i % 3 == 1 else 'Design'} insights",
            'category': np.random.choice(['Technology', 'Business', 'Design', 'Marketing', 'Strategy']),
            'content': f"This is content about {np.random.choice(['artificial intelligence', 'business strategy', 'design thinking', 'digital marketing', 'product development'])} with detailed analysis and insights.",
            'views': np.random.poisson(100) + 10,
            'likes': np.random.poisson(20) + 1,
            'tags': ','.join(np.random.choice(['AI', 'ML', 'Strategy', 'Innovation', 'Growth'], size=np.random.randint(1, 4)))
        }
        for i in range(50)
    ]
    
    return pd.DataFrame(content_data)

def generate_user_profile(user_id: str) -> Dict[str, Any]:
    """Generate a sample user profile"""
    np.random.seed(hash(user_id) % 1000)
    
    return {
        'user_id': user_id,
        'preferred_categories': np.random.choice(['Technology', 'Business', 'Design', 'Marketing', 'Strategy'], size=2, replace=False).tolist(),
        'interests': np.random.choice(['AI', 'ML', 'Strategy', 'Innovation', 'Growth', 'Leadership'], size=3, replace=False).tolist(),
        'engagement_level': np.random.uniform(0.3, 1.0),
        'view_history': [f"content_{i}" for i in np.random.choice(50, size=np.random.randint(5, 15), replace=False)]
    }

def content_based_recommendations(user_profile: Dict[str, Any], content_df: pd.DataFrame, limit: int = 10) -> List[Dict[str, Any]]:
    """Generate content-based recommendations using TF-IDF"""
    try:
        # Create user interest string
        user_interests = ' '.join(user_profile['interests'] + user_profile['preferred_categories'])
        
        # Combine content for TF-IDF
        all_content = [user_interests] + content_df['content'].tolist()
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        tfidf_matrix = vectorizer.fit_transform(all_content)
        
        # Calculate similarity between user and content
        user_vector = tfidf_matrix[0:1]
        content_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(user_vector, content_vectors).flatten()
        
        # Get top recommendations
        top_indices = similarities.argsort()[-limit:][::-1]
        
        recommendations = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Threshold for relevance
                content = content_df.iloc[idx]
                recommendations.append({
                    'content_id': content['content_id'],
                    'title': content['title'],
                    'category': content['category'],
                    'score': float(similarities[idx]),
                    'reason': f"Similar to your interests in {', '.join(user_profile['interests'][:2])}",
                    'algorithm': 'content_based'
                })
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Content-based recommendations failed: {e}")
        return []

def collaborative_filtering_recommendations(user_profile: Dict[str, Any], content_df: pd.DataFrame, limit: int = 10) -> List[Dict[str, Any]]:
    """Generate collaborative filtering recommendations"""
    try:
        # Simulate collaborative filtering based on view history
        viewed_content = user_profile['view_history']
        
        # Find content viewed by similar users (simplified)
        recommendations = []
        
        for _, content in content_df.iterrows():
            if content['content_id'] not in viewed_content:
                # Simulate similarity score based on category preferences
                category_score = 1.0 if content['category'] in user_profile['preferred_categories'] else 0.3
                popularity_score = min(content['views'] / 100, 1.0)
                
                final_score = (category_score * 0.7 + popularity_score * 0.3) * user_profile['engagement_level']
                
                if final_score > 0.4:
                    recommendations.append({
                        'content_id': content['content_id'],
                        'title': content['title'],
                        'category': content['category'],
                        'score': round(final_score, 3),
                        'reason': f"Popular in {content['category']} category",
                        'algorithm': 'collaborative_filtering'
                    })
        
        # Sort by score and return top
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:limit]
        
    except Exception as e:
        logger.error(f"Collaborative filtering recommendations failed: {e}")
        return []

def hybrid_recommendations(user_profile: Dict[str, Any], content_df: pd.DataFrame, limit: int = 10) -> List[Dict[str, Any]]:
    """Generate hybrid recommendations combining multiple algorithms"""
    try:
        # Get recommendations from both algorithms
        content_based = content_based_recommendations(user_profile, content_df, limit)
        collaborative = collaborative_filtering_recommendations(user_profile, content_df, limit)
        
        # Combine and weight recommendations
        combined = {}
        
        # Add content-based recommendations (weight: 0.6)
        for rec in content_based:
            content_id = rec['content_id']
            if content_id not in combined:
                combined[content_id] = rec.copy()
                combined[content_id]['score'] *= 0.6
            else:
                combined[content_id]['score'] += rec['score'] * 0.6
        
        # Add collaborative filtering recommendations (weight: 0.4)
        for rec in collaborative:
            content_id = rec['content_id']
            if content_id not in combined:
                combined[content_id] = rec.copy()
                combined[content_id]['score'] *= 0.4
                combined[content_id]['reason'] = rec['reason']
            else:
                combined[content_id]['score'] += rec['score'] * 0.4
                combined[content_id]['reason'] += f" and {rec['reason']}"
        
        # Sort by final score and return top
        final_recommendations = sorted(combined.values(), key=lambda x: x['score'], reverse=True)
        
        for rec in final_recommendations:
            rec['algorithm'] = 'hybrid'
        
        return final_recommendations[:limit]
        
    except Exception as e:
        logger.error(f"Hybrid recommendations failed: {e}")
        return []

@router.post("/content", response_model=RecommendationResponse)
async def get_content_recommendations(request: RecommendationRequest):
    """Get personalized content recommendations"""
    try:
        # Generate user profile
        user_profile = generate_user_profile(request.user_id)
        
        # Get content data
        content_df = generate_sample_content()
        
        # Generate recommendations
        recommendations = hybrid_recommendations(user_profile, content_df, request.limit)
        
        if not recommendations:
            # Fallback to popular content
            popular_content = content_df.nlargest(request.limit, 'views')
            recommendations = [
                {
                    'content_id': row['content_id'],
                    'title': row['title'],
                    'category': row['category'],
                    'score': 0.5,
                    'reason': 'Trending content',
                    'algorithm': 'popularity_fallback'
                }
                for _, row in popular_content.iterrows()
            ]
        
        confidence_scores = [rec['score'] for rec in recommendations]
        
        return RecommendationResponse(
            user_id=request.user_id,
            recommendations=recommendations,
            algorithm="hybrid",
            confidence_scores=confidence_scores
        )
        
    except Exception as e:
        logger.error(f"Failed to generate recommendations for user {request.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")

@router.get("/trending")
async def get_trending_content(limit: int = 10):
    """Get trending content recommendations"""
    try:
        content_df = generate_sample_content()
        
        # Calculate trending score (recent views + engagement)
        content_df['trending_score'] = (
            content_df['views'] * 0.4 + 
            content_df['likes'] * 0.6
        )
        
        trending_content = content_df.nlargest(limit, 'trending_score')
        
        return {
            "trending": [
                {
                    'content_id': row['content_id'],
                    'title': row['title'],
                    'category': row['category'],
                    'score': float(row['trending_score']),
                    'views': int(row['views']),
                    'likes': int(row['likes'])
                }
                for _, row in trending_content.iterrows()
            ],
            "algorithm": "trending_analysis",
            "updated_at": pd.Timestamp.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get trending content: {e}")
        raise HTTPException(status_code=500, detail="Failed to get trending content")

@router.get("/categories/{category}")
async def get_category_recommendations(category: str, limit: int = 10):
    """Get recommendations for a specific category"""
    try:
        content_df = generate_sample_content()
        
        # Filter by category
        category_content = content_df[content_df['category'] == category]
        
        if category_content.empty:
            raise HTTPException(status_code=404, detail=f"No content found for category: {category}")
        
        # Sort by engagement
        category_content = category_content.sort_values('views', ascending=False)
        
        recommendations = [
            {
                'content_id': row['content_id'],
                'title': row['title'],
                'category': row['category'],
                'score': min(row['views'] / 100, 1.0),
                'views': int(row['views']),
                'reason': f"Best in {category} category"
            }
            for _, row in category_content.head(limit).iterrows()
        ]
        
        return {
            "category": category,
            "recommendations": recommendations,
            "total_available": len(category_content)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get category recommendations for {category}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get category recommendations")
