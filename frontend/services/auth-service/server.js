const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(express.json());

// Rate limiting para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: { error: 'TooManyRequests', message: 'Demasiados intentos' }
});

// Conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Generar tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Endpoints
app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear usuario en DB
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, 'student']
    );
    
    const user = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.status(201).json({
      message: 'Usuario creado',
      data: { user: { ...user, password: undefined }, accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.json({
      message: 'Login exitoso',
      data: { user: { ...user, password: undefined }, accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});