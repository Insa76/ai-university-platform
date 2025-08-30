from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AI University Tutor Service", version="1.0.0")

# Load model (this would be replaced with a more specialized educational model)
model_name = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

class ChatMessage(BaseModel):
    message: str
    course_id: Optional[str] = None
    context: Optional[str] = None
    student_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str]
    timestamp: str

class TutorPersonality:
    def __init__(self, subject="general"):
        self.subject = subject
        self.personalities = {
            "data_science": {
                "tone": "analítico y preciso",
                "examples": ["ejemplo práctico", "análisis estadístico", "visualización"],
                "focus": "conceptos técnicos y aplicaciones reales"
            },
            "programming": {
                "tone": "práctico y directo",
                "examples": ["código funcional", "debugging", "mejores prácticas"],
                "focus": "solución de problemas y programación"
            },
            "general": {
                "tone": "amigable y explicativo",
                "examples": ["analogías simples", "ejemplos cotidianos", "explicaciones claras"],
                "focus": "comprensión fundamental"
            }
        }
    
    def get_personality(self):
        return self.personalities.get(self.subject, self.personalities["general"])

# Mock database for chat history
chat_history = {}

@app.get("/")
async def root():
    return {"message": "AI University Tutor Service", "status": "running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(message: ChatMessage):
    try:
        # Get personality based on course
        personality = TutorPersonality(message.course_id or "general")
        tutor_style = personality.get_personality()
        
        # Prepare input for model
        input_text = f"Estudiante pregunta: {message.message}\n"
        input_text += f"Tutor ({tutor_style['tone']}): "
        
        # Tokenize input
        inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
        
        # Generate response (simplified for demo)
        with torch.no_grad():
            outputs = model.generate(
                inputs, 
                max_length=200, 
                num_return_sequences=1, 
                temperature=0.7,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode response
        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response_text = response_text.replace(input_text, "").strip()
        
        # If model response is empty or too short, provide a default response
        if len(response_text) < 10:
            response_text = f"Como tutor virtual especializado en {tutor_style['focus']}, puedo ayudarte con esa pregunta. "
            response_text += f"Te sugiero que consideres {tutor_style['examples'][0]} para entender mejor este concepto."
        
        # Generate suggestions based on personality
        suggestions = tutor_style["examples"]
        
        # Store in chat history
        if message.student_id:
            if message.student_id not in chat_history:
                chat_history[message.student_id] = []
            chat_history[message.student_id].append({
                "message": message.message,
                "reply": response_text,
                "timestamp": "2024-01-01T00:00:00Z"
            })
        
        return ChatResponse(
            reply=response_text,
            suggestions=suggestions,
            timestamp="2024-01-01T00:00:00Z"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/history/{student_id}")
async def get_chat_history(student_id: str):
    """Get chat history for a student"""
    return chat_history.get(student_id, [])

@app.post("/evaluate")
async def evaluate_student_performance(data: dict):
    """Evaluate student performance and provide feedback"""
    # Mock evaluation logic
    return {
        "score": 85,
        "feedback": "¡Excelente trabajo! Has demostrado un buen entendimiento del tema.",
        "areas_for_improvement": ["Práctica adicional en ejercicios complejos"],
        "next_steps": ["Proceder al siguiente módulo", "Revisar conceptos clave"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)