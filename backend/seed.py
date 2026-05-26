import asyncio
from prisma import Prisma
from api.auth import get_password_hash

async def main():
    db = Prisma()
    await db.connect()
    
    # Check if a test user exists
    user = await db.user.find_unique(where={"email": "test@example.com"})
    if not user:
        user = await db.user.create(
            data={
                "name": "Agri Tester",
                "email": "test@example.com",
                "password": get_password_hash("password123")
            }
        )
        print("Created test user: test@example.com / password123")
    else:
        print("User test@example.com already exists.")
        
    # Check if predictions already exist
    existing = await db.prediction.find_first(where={"userId": user.id})
    if existing:
        print("Database already has predictions. Skipping seeding to prevent duplicates.")
        await db.disconnect()
        return

    # Create some mock predictions
    mock_predictions = [
        {
            "userId": user.id,
            "plantName": "Tomato",
            "diseaseName": "Early Blight",
            "confidence": 88.5,
            "isHealthy": False,
            "topPredictions": '[{"plant_name": "Tomato", "disease_name": "Early Blight", "confidence": 88.5}, {"plant_name": "Tomato", "disease_name": "Late Blight", "confidence": 9.2}]',
            "recommendations": '{"message": "Isolate the plant, remove infected leaves, and use copper-based fungicides.", "fungicides": ["Copper Fungicide", "Chlorothalonil"], "precautions": ["Avoid overhead watering", "Prune lower leaves"]}'
        },
        {
            "userId": user.id,
            "plantName": "Apple",
            "diseaseName": "Black Rot",
            "confidence": 92.1,
            "isHealthy": False,
            "topPredictions": '[{"plant_name": "Apple", "disease_name": "Black Rot", "confidence": 92.1}, {"plant_name": "Apple", "disease_name": "Cedar Rust", "confidence": 5.4}]',
            "recommendations": '{"message": "Prune infected branches and apply fungicides like captan during the growing season.", "fungicides": ["Captan", "Myclobutanil"], "precautions": ["Remove mummified apples from trees", "Dispose of leaf litter"]}'
        },
        {
            "userId": user.id,
            "plantName": "Grape",
            "diseaseName": "healthy",
            "confidence": 98.4,
            "isHealthy": True,
            "topPredictions": '[{"plant_name": "Grape", "disease_name": "healthy", "confidence": 98.4}]',
            "recommendations": '{"message": "Continue regular watering and monitoring. Ensure good air circulation.", "preventive_measures": ["Keep weeds controlled", "Prune to allow sunlight penetration"]}'
        }
    ]
    
    for pred in mock_predictions:
        await db.prediction.create(data=pred)
        
    print("Seeded 3 mock predictions successfully!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
