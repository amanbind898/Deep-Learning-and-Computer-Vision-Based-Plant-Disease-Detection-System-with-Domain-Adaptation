from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from api.db import db
from api.deps import get_current_user
from prisma.models import User, Prediction
import json

router = APIRouter()

@router.get("/")
async def get_history(current_user: User = Depends(get_current_user)):
    predictions = await db.prediction.find_many(
        where={"userId": current_user.id},
        order={"createdAt": "desc"}
    )
    
    # Process json strings back to lists/dicts for API response
    results = []
    for p in predictions:
        p_dict = p.model_dump()
        try:
            p_dict["topPredictions"] = json.loads(p.topPredictions)
            p_dict["recommendations"] = json.loads(p.recommendations)
        except:
            p_dict["topPredictions"] = []
            p_dict["recommendations"] = {}
        results.append(p_dict)
        
    return {"predictions": results}

@router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    predictions = await db.prediction.find_many(
        where={"userId": current_user.id}
    )
    
    total_scans = len(predictions)
    healthy_plants = sum(1 for p in predictions if p.isHealthy)
    diseased_plants = total_scans - healthy_plants
    
    disease_distribution = {}
    for p in predictions:
        if not p.isHealthy:
            disease_distribution[p.diseaseName] = disease_distribution.get(p.diseaseName, 0) + 1
            
    recent_activity = []
    for p in sorted(predictions, key=lambda x: x.createdAt, reverse=True)[:5]:
        recent_activity.append({
            "id": p.id,
            "plantName": p.plantName,
            "diseaseName": p.diseaseName,
            "date": p.createdAt.isoformat()
        })
        
    return {
        "totalScans": total_scans,
        "healthyPlants": healthy_plants,
        "diseasedPlants": diseased_plants,
        "diseaseDistribution": disease_distribution,
        "recentActivity": recent_activity
    }

@router.delete("/{prediction_id}")
async def delete_prediction(prediction_id: str, current_user: User = Depends(get_current_user)):
    prediction = await db.prediction.find_unique(where={"id": prediction_id})
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
        
    if prediction.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this prediction")
        
    await db.prediction.delete(where={"id": prediction_id})
    return {"success": True, "message": "Prediction deleted"}
