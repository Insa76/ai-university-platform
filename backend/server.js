const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Import database connection
const { sequelize } = require('./src/models');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "", "https:"],
      connectSrc: ["'self'", "http://localhost:8000"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes
  message: {
    error: 'TooManyRequests',
    message: 'Demasiadas solicitudes desde esta IP. Por favor, inténtalo de nuevo en 15 minutos.'
  }
});

app.use(globalLimiter);

// Logging
app.use(morgan('combined'));

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente');
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI University Backend API', 
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/courses', require('./src/routes/courses.routes'));
app.use('/api/tutor', require('./src/routes/tutor.routes'));
app.use('/api/assessments', require('./src/routes/assessments.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      error: 'BadRequest', 
      message: 'JSON inválido en la solicitud' 
    });
  }

  res.status(500).json({ 
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'NotFound', 
    message: 'Ruta no encontrada' 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;