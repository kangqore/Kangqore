from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from textblob import TextBlob
import logging
import random

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, str]] = []
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    intent: str
    sentiment: float
    confidence: float

# Knowledge Base & Intents
INTENTS = {
    "pricing": {
        "keywords": ["price", "cost", "quote", "pricing", "expensive", "cheap", "payment", "rates"],
        "responses": [
            "Our pricing models are tailored to project scope and complexity. We offer Time & Material, Fixed Cost, and Dedicated Team models. Would you like a consultation for a quote?",
            "Pricing varies based on your specific needs. I can connect you with our sales team for a detailed estimate.",
            "We believe in transparent pricing. Costs depend on the technology stack and timeline. Shall we schedule a call to discuss your requirements?"
        ]
    },
    "services": {
        "keywords": ["service", "offer", "do you do", "capabilities", "cloud", "ai", "web", "mobile", "development", "consulting"],
        "responses": [
            "Kangqore offers comprehensive Digital Transformation services: Cloud Solutions, AI/ML Integration, Custom Software Development, and Strategic Consulting.",
            "We specialize in modernizing businesses through technology. Our core pillars are Cloud Architecture, AI & Analytics, and Full-Stack Engineering.",
            "Our expertise spans across Web/Mobile App Development, Enterprise Software, and cutting-edge AI Solutions. Which area are you interested in?"
        ]
    },
    "careers": {
        "keywords": ["job", "career", "hiring", "openings", "join", "team", "engineer", "developer", "vacancy"],
        "responses": [
            "We are always looking for top talent! Check out our Careers page for current openings in Engineering, Design, and Product Management.",
            "Kangqore is a great place to grow. If you're passionate about technology, please visit our Careers section to apply.",
            "We prioritize innovation and culture. If you think you'd be a good fit, we'd love to see your application via our Careers portal."
        ]
    },
    "contact": {
        "keywords": ["contact", "email", "phone", "address", "location", "reach", "support", "help"],
        "responses": [
            "You can reach us at contact@kangqore.com or via the contact form on our website. We usually respond within 24 hours.",
            "Our support team is ready to assist. Please use the 'Contact Us' page or drop us an email.",
            "We are headquartered in [City]. For immediate inquiries, please use the contact form."
        ]
    },
    "greeting": {
        "keywords": ["hi", "hello", "hey", "greetings", "morning", "afternoon", "evening"],
        "responses": [
            "Hello! I'm eQORE, your AI assistant. How can I help you innovate today?",
            "Hi there! Welcome to Kangqore. What can I do for you?",
            "Greetings! I'm here to answer your questions about our services and solutions."
        ]
    }
}

def analyze_intent(message: str) -> tuple[str, float]:
    """Detect intent based on keyword overlap"""
    message_lower = message.lower()
    
    best_intent = "general"
    max_score = 0.0
    
    for intent, data in INTENTS.items():
        score = 0
        for keyword in data["keywords"]:
            if keyword in message_lower:
                score += 1
        
        # Normalize score slightly (simple heuristic)
        if score > max_score:
            max_score = score
            best_intent = intent
            
    # Confidence calculation
    confidence = min(1.0, max_score * 0.3) if max_score > 0 else 0.0
    return best_intent, confidence

@router.post("/query", response_model=ChatResponse)
async def chat_query(request: ChatRequest):
    """Process a chat message and return an AI response"""
    try:
        # Sentiment Analysis
        blob = TextBlob(request.message)
        sentiment = blob.sentiment.polarity
        
        # Intent Detection
        intent, confidence = analyze_intent(request.message)
        
        # Select Response
        if intent in INTENTS and confidence > 0:
            response_text = random.choice(INTENTS[intent]["responses"])
        else:
            # Fallback / General Conversation
            if sentiment < -0.3:
                response_text = "I sense some frustration. Please let me know how we can improve or if you'd like to speak to a human representative."
            elif sentiment > 0.5:
                response_text = "I'm glad to hear that! Is there anything specific about our services you'd like to explore?"
            else:
                response_text = "I'm eQORE, an AI assistant for Kangqore. I can tell you about our Services, Pricing, or Careers. What would you like to know?"
                
        # Context Awareness (Simple mock)
        if request.conversation_history and len(request.conversation_history) > 2:
            # If conversation is long, maybe try to wrap up or ask if they need anything else
            # (Logic kept simple for now)
            pass

        logger.info(f"Chat Query: '{request.message}' | Intent: {intent} | Sentiment: {sentiment}")
        
        return ChatResponse(
            response=response_text,
            intent=intent,
            sentiment=round(sentiment, 2),
            confidence=round(confidence, 2)
        )

    except Exception as e:
        logger.error(f"Chat processing failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")
