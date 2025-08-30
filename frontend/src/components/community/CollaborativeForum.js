// src/components/community/CollaborativeForum.js
import { useState } from 'react';

export default function CollaborativeForum() {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "¿Alguien tiene dudas sobre regresión lineal?",
      author: "María González",
      replies: 12,
      likes: 24,
      tags: ["machine-learning", "matemáticas"],
      lastActivity: "Hace 2 horas",
      isPinned: true
    },
    {
      id: 2,
      title: "Proyecto final de visualización de datos",
      author: "Carlos Rodríguez",
      replies: 8,
      likes: 15,
      tags: ["python", "proyecto"],
      lastActivity: "Hace 5 horas",
      isPinned: false
    },
    {
      id: 3,
      title: "Recursos recomendados para estadística",
      author: "Ana Martínez",
      replies: 5,
      likes: 18,
      tags: ["recursos", "estadística"],
      lastActivity: "Hace 1 día",
      isPinned: false
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim()) return;
    
    const post = {
      id: Date.now(),
      title: newPost.title,
      author: "Tú",
      replies: 0,
      likes: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      lastActivity: "Ahora mismo",
      isPinned: false
    };
    
    setDiscussions(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', tags: '' });
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Comunidad de Aprendizaje</h3>
        <button className="btn btn-primary btn-sm">
          + Nueva Discusión
        </button>
      </div>

      {/* Formulario para nueva publicación */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <input
          type="text"
          placeholder="Título de tu discusión..."
          value={newPost.title}
          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
          className="w-full input-field mb-3"
        />
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Etiquetas (separadas por comas)"
            value={newPost.tags}
            onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
            className="flex-1 input-field text-sm"
          />
          <button 
            onClick={handleCreatePost}
            className="btn btn-secondary btn-sm"
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Lista de discusiones */}
      <div className="space-y-4">
        {discussions.map(discussion => (
          <div 
            key={discussion.id} 
            className={`p-4 border rounded-xl hover:shadow-md transition-all duration-300 ${
              discussion.isPinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {discussion.isPinned && (
                    <span className="mr-2 text-yellow-600">📌</span>
                  )}
                  <h4 className="font-semibold text-gray-800">{discussion.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {discussion.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">👤 {discussion.author}</span>
                  <span className="mr-4">💬 {discussion.replies} respuestas</span>
                  <span className="mr-4">👍 {discussion.likes} likes</span>
                  <span>⏱️ {discussion.lastActivity}</span>
                </div>
              </div>
              
              <button className="btn btn-ghost btn-sm">
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}