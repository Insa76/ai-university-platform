// src/components/analytics/PredictiveAnalytics.js
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PredictiveAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    currentProgress: 67,
    predictedCompletion: 85,
    weeklyTrend: [45, 52, 58, 63, 67],
    predictedTrend: [67, 72, 78, 82, 85],
    insights: [
      "Tu ritmo de aprendizaje es 15% más rápido que el promedio",
      "Te recomiendo dedicar 2 horas más esta semana para mantener el progreso",
      "Tienes fortalezas en programación pero podrías mejorar en estadística"
    ]
  });

  const chartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
    datasets: [
      {
        label: 'Progreso Real',
        data: analyticsData.weeklyTrend,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Progreso Predicho',
        data: analyticsData.predictedTrend,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Aprendizaje Predictivo'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Análisis Predictivo de Aprendizaje</h3>
      
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{analyticsData.currentProgress}%</div>
          <div className="text-sm text-blue-800">Progreso Actual</div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{analyticsData.predictedCompletion}%</div>
          <div className="text-sm text-green-800">Predicción Final</div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">+18%</div>
          <div className="text-sm text-purple-800">Mejora Proyectada</div>
        </div>
      </div>

      <div className="h-64 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <h4 className="font-bold text-yellow-800 mb-2">Insights Inteligentes</h4>
        <ul className="space-y-1">
          {analyticsData.insights.map((insight, index) => (
            <li key={index} className="text-sm text-yellow-700 flex items-start">
              <span className="mr-2">💡</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}