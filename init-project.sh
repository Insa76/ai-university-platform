#!/bin/bash

echo "🚀 Inicializando AI University Platform..."

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p ai-university-platform/{backend,frontend,ai-service,docs/{technical,academic,business}}

# Inicializar backend
echo "🔧 Configurando backend..."
cd ai-university-platform/backend
npm init -y
npm install express cors helmet dotenv jsonwebtoken bcryptjs pg sequelize joi morgan express-rate-limit
npm install --save-dev nodemon jest supertest

# Inicializar frontend
echo "🎨 Configurando frontend..."
cd ../frontend
npx create-next-app@latest . --ts --eslint --tailwind --src-dir --app --import-alias "@/*"

# Inicializar AI service
echo "🤖 Configurando servicio de IA..."
cd ../ai-service
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
pip install fastapi uvicorn python-dotenv pydantic transformers torch sentence-transformers numpy pandas scikit-learn

# Crear archivos de documentación
echo "📝 Creando documentación..."
cd ../docs/technical
touch TECH_ARCHITECTURE.md AI_TUTOR_DESIGN.md API_DOCUMENTATION.md
cd ../academic
touch CURRICULUM_PILOT.md CONTENT_STRATEGY.md
cd ../business
touch BUSINESS_PLAN.md MARKETING_STRATEGY.md

echo "✅ Proyecto inicializado correctamente!"
echo "Para comenzar:"
echo "1. cd backend && npm run dev"
echo "2. cd frontend && npm run dev"
echo "3. cd ai-service && python app.py"