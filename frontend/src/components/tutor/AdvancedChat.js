// src/components/tutor/AdvancedChat.js
import { useState, useRef, useEffect } from 'react';

export default function AdvancedChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: '¡Hola! Soy tu tutor virtual de IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular respuesta del tutor
    setTimeout(() => {
      const aiResponses = [
        "Excelente pregunta. Déjame explicarte eso con más detalle...",
        "Entiendo tu duda. Aquí tienes una explicación paso a paso:",
        "¡Buena observación! Eso es un concepto importante en este campo.",
        "Para entender mejor, te recomiendo revisar estos puntos clave:"
      ];

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
        type: 'text',
        suggestions: [
          "¿Puedes darme un ejemplo?",
          "¿Cómo se aplica en la práctica?",
          "¿Hay recursos adicionales?"
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-md' 
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}>
              <p className="text-sm">{message.content}</p>
              
              {message.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-white text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 input-field text-sm py-2 px-3"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="btn btn-primary py-2 px-4 text-sm"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}