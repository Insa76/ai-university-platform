// src/components/dashboard/AIRecommendations.js
import { useState, useEffect } from 'react';

export default function AIRecommendations({ userPreferences }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular recomendaciones basadas en IA
    const mockRecommendations = [
      {
        id: 1,
        title: "Curso recomendado: Machine Learning Avanzado",
        type: "course",
        reason: "Basado en tu progreso en Ciencia de Datos",
        priority: "high",
        action: "Explorar curso"
      },
      {
        id: 2,
        title: "Tutoría personalizada disponible",
        type: "tutor",
        reason: "Detectamos dificultades en regresión lineal",
        priority: "medium",
        action: "Agendar sesión"
      },
      {
        id: 3,
        title: "Desafío semanal: Proyecto de Visualización",
        type: "challenge",
        reason: "Para reforzar tus habilidades de Python",
        priority: "low",
        action: "Participar"
      }
    ];
    
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  }, [userPreferences]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recomendaciones Inteligentes</h3>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map(rec => (
            <div 
              key={rec.id} 
              className={`border-l-4 p-4 rounded-r ${getPriorityColor(rec.priority)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                </div>
                <button className="btn btn-outline btn-sm">
                  {rec.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}