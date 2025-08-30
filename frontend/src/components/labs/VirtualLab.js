// src/components/labs/VirtualLab.js
import { useState } from 'react';

export default function VirtualLab() {
  const [activeLab, setActiveLab] = useState(null);
  const [labOutput, setLabOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const labs = [
    {
      id: 1,
      title: "Análisis de Datos con Pandas",
      description: "Explora y analiza datasets reales usando pandas",
      difficulty: "Intermedio",
      estimatedTime: "45 min",
      technologies: ["Python", "Pandas", "Jupyter"]
    },
    {
      id: 2,
      title: "Visualización Interactiva",
      description: "Crea gráficos interactivos con Plotly",
      difficulty: "Avanzado",
      estimatedTime: "60 min",
      technologies: ["Python", "Plotly", "Dash"]
    },
    {
      id: 3,
      title: "Modelo de Regresión Lineal",
      description: "Implementa y entrena un modelo de regresión",
      difficulty: "Intermedio",
      estimatedTime: "50 min",
      technologies: ["Python", "Scikit-learn", "Matplotlib"]
    }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    setLabOutput(''); // Limpiar salida anterior
    
    // Simular ejecución de código
    setTimeout(() => {
      const outputs = [
        "Iniciando análisis de datos...\nLeyendo dataset de 1000 filas...\nProcesando columnas...\nAnálisis completado. Resultados guardados.",
        "Creando visualización interactiva...\nGenerando gráfico de dispersión...\nAgregando controles interactivos...\nVisualización lista.",
        "Entrenando modelo de regresión...\nDividiendo datos en entrenamiento/prueba...\nModelo entrenado con 92% de precisión...\nGuardando modelo."
      ];
      
      setLabOutput(outputs[Math.floor(Math.random() * outputs.length)]);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Laboratorios Virtuales</h3>
      
      {!activeLab ? (
        <div className="grid md:grid-cols-3 gap-4">
          {labs.map(lab => (
            <div 
              key={lab.id} 
              className="card p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setActiveLab(lab)}
            >
              <h4 className="font-bold text-gray-800 mb-2">{lab.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{lab.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="badge badge-secondary text-xs">{lab.difficulty}</span>
                <span className="text-xs text-gray-500">{lab.estimatedTime}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {lab.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <button className="w-full btn btn-outline btn-sm mt-3">
                Iniciar Laboratorio
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-800">{activeLab.title}</h4>
            <button 
              onClick={() => setActiveLab(null)}
              className="btn btn-ghost btn-sm"
            >
              ← Volver
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="card p-4 mb-4">
                <h5 className="font-semibold mb-2">Instrucciones</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Sigue estos pasos para completar el laboratorio:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Importa las librerías necesarias</li>
                  <li>Carga el dataset proporcionado</li>
                  <li>Realiza el análisis solicitado</li>
                  <li>Guarda los resultados</li>
                </ol>
              </div>
              
              <div className="card p-4">
                <h5 className="font-semibold mb-2">Editor de Código</h5>
                <textarea 
                  className="w-full h-48 font-mono text-sm p-3 border rounded-lg bg-gray-50"
                  defaultValue={`# Laboratorio: ${activeLab.title}\n\n# Tu código aquí\nimport pandas as pd\nimport numpy as np\n\n# Comienza tu análisis...`}
                />
                <button 
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="w-full btn btn-primary mt-3"
                >
                  {isRunning ? 'Ejecutando...' : 'Ejecutar Código'}
                </button>
              </div>
            </div>
            
            <div>
              <div className="card p-4">
                <h5 className="font-semibold mb-2">Salida del Laboratorio</h5>
                <div className="h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg overflow-y-auto">
                  {isRunning ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                      Ejecutando código...
                    </div>
                  ) : labOutput ? (
                    <pre>{labOutput}</pre>
                  ) : (
                    <div className="text-gray-500">
                      La salida del laboratorio aparecerá aquí...
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card p-4 mt-4">
                <h5 className="font-semibold mb-2">Recursos Adicionales</h5>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <span className="mr-2">📚</span>
                      Documentación oficial
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <span className="mr-2">🎥</span>
                      Tutorial en video
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <span className="mr-2">❓</span>
                      Foro de ayuda
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}