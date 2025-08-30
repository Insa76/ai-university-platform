const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite por IP
});
app.use(limiter);

// Proxy a microservicios
app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api' }
}));

app.use('/api/courses', createProxyMiddleware({
  target: 'http://course-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/courses': '/api' }
}));

app.use('/api/tutor', createProxyMiddleware({
  target: 'http://tutor-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/tutor': '/api' }
}));

app.use('/api/assessments', createProxyMiddleware({
  target: 'http://assessment-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/assessments': '/api' }
}));

app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3005',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api' }
}));

app.use('/api/analytics', createProxyMiddleware({
  target: 'http://analytics-service:3006',
  changeOrigin: true,
  pathRewrite: { '^/api/analytics': '/api' }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'API Gateway',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});