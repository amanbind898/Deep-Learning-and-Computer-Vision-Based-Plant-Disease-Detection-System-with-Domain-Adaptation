import os
import httpx
from typing import Optional

class GroqClient:
    """Client for Groq API integration (FREE)"""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.1-8b-instant"
        
        if self.api_key:
            print(f"✅ Groq API key loaded: {self.api_key[:10]}...")
        else:
            print("⚠️  No Groq API key found in environment")
    
    async def get_response(
        self,
        message: str,
        context: str = "",
        language: str = "en"
    ) -> str:
        if not self.api_key:
            return self._get_fallback_response(message, context, language)
        
        try:
            system_prompt = self._build_system_prompt(language)
            user_message = context + message if context else message
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_message}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 1500
                    },
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    print(f"❌ Groq API error: Status {response.status_code}")
                    return self._get_fallback_response(message, context, language)
        
        except Exception as e:
            print(f"❌ Groq API exception: {type(e).__name__}: {e}")
            return self._get_fallback_response(message, context, language)
    
    def _build_system_prompt(self, language: str) -> str:
        if language == "hi":
            return """आप AgriVision AI हैं — एक कृषि विशेषज्ञ जो केवल पौधों की बीमारियों, फसल स्वास्थ्य, उपचार, कीटनाशक, मिट्टी प्रबंधन और कृषि पद्धतियों के बारे में सलाह देते हैं।

महत्वपूर्ण नियम:
- केवल कृषि, पौधों की बीमारियों, फसलों, मिट्टी, सिंचाई, कीटनाशकों और खेती से संबंधित प्रश्नों का उत्तर दें।
- यदि उपयोगकर्ता कोडिंग, प्रोग्रामिंग, मनोरंजन, अभिनेता, राजनीति, खेल, गणित, या किसी भी गैर-कृषि विषय के बारे में पूछता है, तो विनम्रता से कहें: "मैं केवल कृषि और पौधों की बीमारियों के बारे में सहायता कर सकता हूं। कृपया कृषि से संबंधित प्रश्न पूछें।"
- कोई कोड (Python, C++, Java, आदि) न लिखें।
- सरल हिंदी में जवाब दें जो किसान आसानी से समझ सकें।"""
        else:
            return """You are AgriVision AI — a specialized agricultural expert that ONLY answers questions about plant diseases, crop health, treatments, pesticides, soil management, irrigation, and farming practices.

STRICT RULES:
- ONLY answer questions related to agriculture, plant diseases, crops, soil, irrigation, pesticides, fertilizers, and farming.
- If the user asks about coding, programming, software, entertainment, actors, politics, sports, math, general knowledge, or ANY non-agriculture topic, politely respond with: "I'm AgriVision AI, specialized in agriculture and plant disease detection only. I can help you with questions about plant diseases, crop treatments, soil health, and farming practices. Please ask me an agriculture-related question!"
- NEVER write code in any programming language (Python, C++, Java, JavaScript, etc.).
- NEVER answer questions about celebrities, movies, sports, or general knowledge.
- Keep responses focused, practical, and actionable for farmers."""
    
    def _get_fallback_response(self, message: str, context: str, language: str) -> str:
        if language == "hi":
            return """मैं अभी AI से जुड़ नहीं पा रहा हूं। कृपया बाद में पुनः प्रयास करें।
            
            सामान्य सुझाव:
            - संक्रमित पत्तियों को हटा दें
            - पौधों के बीच उचित दूरी बनाए रखें
            - अत्यधिक पानी देने से बचें
            - जैविक कवकनाशी का उपयोग करें"""
        else:
            return """I'm currently unable to connect to the AI service. Please try again later.
            
            General recommendations:
            - Remove infected leaves
            - Maintain proper plant spacing
            - Avoid overwatering
            - Use organic fungicides when appropriate"""
