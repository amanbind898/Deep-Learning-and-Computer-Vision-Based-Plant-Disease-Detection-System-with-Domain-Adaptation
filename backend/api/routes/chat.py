from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import sys

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, parent_dir)

from utils.groq_client import GroqClient

router = APIRouter()

# Initialize Groq client (FREE)
groq = GroqClient()

class ChatRequest(BaseModel):
    message: str
    plant_name: Optional[str] = None
    disease_name: Optional[str] = None
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    language: str

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        context = ""
        if request.plant_name and request.disease_name:
            context = f"Plant: {request.plant_name}, Disease: {request.disease_name}. "
        
        response = await groq.get_response(
            message=request.message,
            context=context,
            language=request.language
        )
        
        return ChatResponse(response=response, language=request.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/explain")
async def explain_prediction(plant_name: str, disease_name: str, confidence: float, language: str = "en"):
    try:
        prompt = f"""Explain in simple terms why a plant disease detection model 
        might identify {plant_name} with {disease_name} at {confidence:.1f}% confidence. 
        What visual symptoms does this disease typically show?"""
        
        if language == "hi":
            prompt += " Please respond in Hindi."
        
        explanation = await groq.get_response(message=prompt, context="", language=language)
        return {"explanation": explanation, "language": language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")
