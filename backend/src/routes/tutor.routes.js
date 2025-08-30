const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Chat with AI tutor
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, courseId, context } = req.body;
    
    // This would integrate with the AI service
    // For now, returning a mock response
    const response = {
      reply: `Gracias por tu pregunta sobre "${message}". Como tutor virtual, puedo ayudarte con conceptos específicos del curso. ¿En qué tema específico necesitas ayuda?`,
      suggestions: [
        "Explicar concepto básico",
        "Ejemplos prácticos",
        "Ejercicios adicionales"
      ],
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history', authenticate, async (req, res) => {
  try {
    // Mock chat history
    const history = [
      {
        id: 1,
        message: "¿Qué es machine learning?",
        reply: "Machine Learning es una rama de la inteligencia artificial...",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;