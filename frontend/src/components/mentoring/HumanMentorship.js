// src/components/mentoring/HumanMentorship.js
import { useState } from 'react';

export default function HumanMentorship() {
  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: "Dra. Elena Martínez",
      specialty: "Machine Learning",
      experience: "15 años",
      availability: "Lun, Mie, Vie 14:00-17:00",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
      languages: ["Español", "Inglés"],
      nextSlot: "Mañana 15:00"
    },
    {
      id: 2,
      name: "Ing. Carlos Rodríguez",
      specialty: "Desarrollo Web",
      experience: "12 años",
      availability: "Mar, Jue 09:00-12:00",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      languages: ["Español", "Francés"],
      nextSlot: "Miércoles 10:00"
    },
    {
      id: 3,
      name: "Mtra. Ana López",
      specialty: "Visualización de Datos",
      experience: "10 años",
      availability: "Lun-Vie 16:00-19:00",
      rating: 4.95,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      languages: ["Español", "Inglés", "Alemán"],
      nextSlot: "Hoy 17:00"
    }
  ]);

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const handleBookSession = (mentor) => {
    setSelectedMentor(mentor);
    setShowBooking(true);
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Mentoría Humana</h3>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <span className="text-blue-600 text-xl mr-3">💡</span>
          <div>
            <h4 className="font-semibold text-blue-800">¿Necesitas ayuda personalizada?</h4>
            <p className="text-blue-700 text-sm mt-1">
              Nuestros mentores expertos están disponibles para sesiones personalizadas 
              basadas en tu progreso y necesidades específicas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="card p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <img 
                src={mentor.image} 
                alt={mentor.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{mentor.name}</h4>
                <p className="text-sm text-gray-600">{mentor.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Experiencia:</span>
                <span className="font-medium">{mentor.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rating:</span>
                <span className="font-medium">⭐ {mentor.rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Próximo slot:</span>
                <span className="font-medium text-green-600">{mentor.nextSlot}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {mentor.languages.map((lang, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {lang}
                </span>
              ))}
            </div>
            
            <button 
              onClick={() => handleBookSession(mentor)}
              className="w-full btn btn-primary btn-sm"
            >
              Agendar Sesión
            </button>
          </div>
        ))}
      </div>

      {showBooking && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Agendar Sesión con {selectedMentor.name}</h3>
              <button 
                onClick={() => setShowBooking(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Especialidad: {selectedMentor.specialty}</p>
              <p className="text-gray-600">Disponibilidad: {selectedMentor.availability}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona fecha y hora
              </label>
              <select className="w-full input-field">
                <option>{selectedMentor.nextSlot}</option>
                <option>Mañana 16:00</option>
                <option>Jueves 10:00</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema de la sesión
              </label>
              <textarea 
                className="w-full input-field" 
                rows="3"
                placeholder="¿Sobre qué tema necesitas ayuda?"
              ></textarea>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowBooking(false)}
                className="flex-1 btn btn-ghost"
              >
                Cancelar
              </button>
              <button className="flex-1 btn btn-primary">
                Confirmar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}