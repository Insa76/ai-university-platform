// src/components/gamification/Achievements.js
import { useState, useEffect } from 'react';

export default function Achievements() {
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Primer Paso",
      description: "Completa tu primer módulo",
      icon: "🎯",
      earned: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Dedicado",
      description: "Estudia 10 horas seguidas",
      icon: "🔥",
      earned: true,
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Maestro del Código",
      description: "Completa 5 proyectos de programación",
      icon: "💻",
      earned: false,
      progress: 3,
      target: 5
    },
    {
      id: 4,
      title: "Explorador",
      description: "Inscríbete en 3 cursos diferentes",
      icon: "🧭",
      earned: false,
      progress: 2,
      target: 3
    }
  ]);

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tus Logros</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`p-4 rounded-xl text-center transition-all duration-300 ${
              achievement.earned 
                ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-200 shadow-sm' 
                : 'bg-gray-50 border border-gray-200 opacity-70'
            }`}
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <h4 className="font-bold text-sm text-gray-800 mb-1">{achievement.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
            
            {achievement.earned ? (
              <div className="text-xs text-green-600 font-semibold">✓ Completado</div>
            ) : (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {achievement.progress}/{achievement.target}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}