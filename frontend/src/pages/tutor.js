import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { tutorAPI } from '../../services/api';

export default function Tutor({ user }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await tutorAPI.chat({
        message: inputMessage,
        course_id: selectedCourse || 'general',
        context: 'student_question',
        student_id: user?.userId || 'anonymous'
      });

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.data.reply,
        suggestions: response.data.suggestions || [],
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error en chat con tutor:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Lo siento, tuve un problema para responder. ¿Puedes reformular tu pregunta?',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Tutor Virtual - AI University</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Tutor Virtual AI</h1>
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-primary hover:text-blue-700"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h2 className="text-xl font-bold">Asistente de Aprendizaje Inteligente</h2>
            <p className="text-blue-100">Puedo ayudarte con cualquier pregunta sobre tus cursos</p>
          </div>

          {/* Selector de curso */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Curso:</label>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">General</option>
                <option value="data_science">Ciencias de Datos e IA</option>
                <option value="software_dev">Desarrollo de Software</option>
                <option value="digital_marketing">Marketing Digital</option>
              </select>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>¡Hola! Soy tu tutor virtual. ¿En qué puedo ayudarte hoy?</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button 
                    onClick={() => setInputMessage('¿Qué es machine learning?')}
                    className="bg-white border border-primary text-primary px-3 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition duration-300"
                  >
                    ¿Qué es machine learning?
                  </button>
                  <button 
                    onClick={() => setInputMessage('Explícame regresión lineal')}
                    className="bg-white border border-primary text-primary px-3 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition duration-300"
                  >
                    Explícame regresión lineal
                  </button>
                  <button 
                    onClick={() => setInputMessage('¿Cómo funciona Python?')}
                    className="bg-white border border-primary text-primary px-3 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition duration-300"
                  >
                    ¿Cómo funciona Python?
                  </button>
                  <button 
                    onClick={() => setInputMessage('¿Qué es un algoritmo?')}
                    className="bg-white border border-primary text-primary px-3 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition duration-300"
                  >
                    ¿Qué es un algoritmo?
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.suggestions && message.sender === 'ai' && message.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 disabled:opacity-50"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}