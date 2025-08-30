// src/pages/dashboard.js (actualizado)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AIRecommendations from '../components/dashboard/AIRecommendations';
import Achievements from '../components/gamification/Achievements';
import PredictiveAnalytics from '../components/analytics/PredictiveAnalytics';
import CollaborativeForum from '../components/community/CollaborativeForum';
import HumanMentorship from '../components/mentoring/HumanMentorship';
import VirtualLab from '../components/labs/VirtualLab';

export default function Dashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: '📊' },
    { id: 'analytics', name: 'Análisis', icon: '📈' },
    { id: 'community', name: 'Comunidad', icon: '👥' },
    { id: 'labs', name: 'Laboratorios', icon: '🔬' },
    { id: 'mentors', name: 'Mentores', icon: '👨‍🏫' }
  ];

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('/images/hero-background.jpg')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(250, 242, 242, 0.32)',
      }}
    >
    
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AI University</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <span className="text-xl">🔔</span>
                </button>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              
              <div className="flex items-center space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:inline text-gray-700">
                  {user.name || 'Estudiante'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="btn btn-ghost btn-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="card p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      ¡Bienvenido de vuelta, {user.name || 'Estudiante'}!
                    </h2>
                    <p className="text-gray-600">
                      Continúa tu camino hacia el dominio de la Ciencia de Datos
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="btn btn-primary">
                      Continuar Aprendizaje
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">Cursos Activos</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">67%</div>
                  <div className="text-sm text-gray-600">Progreso Promedio</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">Horas Estudiadas</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">5</div>
                  <div className="text-sm text-gray-600">Logros</div>
                </div>
              </div>

              {/* Recommendations and Achievements */}
              <div className="grid lg:grid-cols-2 gap-6">
                <AIRecommendations />
                <Achievements />
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                    <span className="text-2xl mb-2">🤖</span>
                    <span className="font-medium text-gray-800">Tutor Virtual</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                    <span className="text-2xl mb-2">📚</span>
                    <span className="font-medium text-gray-800">Mis Cursos</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                    <span className="text-2xl mb-2">🏆</span>
                    <span className="font-medium text-gray-800">Logros</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <PredictiveAnalytics />
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <CollaborativeForum />
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-6">
              <VirtualLab />
            </div>
          )}

          {activeTab === 'mentors' && (
            <div className="space-y-6">
              <HumanMentorship />
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}