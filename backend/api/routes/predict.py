from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io
import numpy as np
from typing import List, Dict
import json
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, parent_dir)

from models.disease_model_pytorch import DiseaseModel
from utils.recommendations import get_treatment_recommendations

router = APIRouter()

# Initialize model (gracefully handle missing model file)
model = None
try:
    model = DiseaseModel()
except Exception as e:
    print(f"⚠️  Model not loaded: {e}")
    print("⚠️  Prediction endpoint will be unavailable. Place agrinet_mixed_v1.pth in ml-training/models/ and restart.")


@router.post("/")
async def predict_disease(file: UploadFile = File(...)):
    """
    Predict plant disease from uploaded image
    
    Returns:
    - predicted_class: Disease name
    - confidence: Prediction confidence (0-100)
    - plant_name: Plant type
    - disease_name: Disease name
    - is_healthy: Boolean
    - top_5_predictions: List of top 5 predictions
    - recommendations: Treatment suggestions
    """
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not loaded. Place agrinet_mixed_v1.pth in ml-training/models/ and restart the server.")
        
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Get prediction
        result = model.predict(image)
        
        # Generate Grad-CAM heatmap
        try:
            result["gradcam_image"] = model.generate_gradcam(image)
        except Exception as e:
            print(f"Warning: Failed to generate Grad-CAM: {str(e)}")
            result["gradcam_image"] = None
        
        # Get treatment recommendations
        recommendations = get_treatment_recommendations(
            result["plant_name"],
            result["disease_name"],
            result["is_healthy"]
        )
        
        # Add recommendations to result
        result["recommendations"] = recommendations
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/classes")
async def get_classes():
    """Get all supported plant disease classes"""
    return {
        "classes": DiseaseModel.CLASS_NAMES,
        "total": len(DiseaseModel.CLASS_NAMES)
    }

@router.get("/supported-plants")
async def get_supported_plants():
    """Get list of supported plant types"""
    plants = set()
    for class_name in DiseaseModel.CLASS_NAMES:
        plant = class_name.split("___")[0].replace("_", " ")
        plants.add(plant)
    
    return {
        "plants": sorted(list(plants)),
        "total": len(plants)
    }
