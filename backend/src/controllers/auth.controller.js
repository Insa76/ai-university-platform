const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateTokens, verifyToken, generateEmailVerificationToken } = require('../utils/jwt');
const rateLimit = require('express-rate-limit');

// Rate limiting para login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: {
    error: 'TooManyRequests',
    message: 'Demasiados intentos de autenticación. Por favor, inténtalo de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de entrada
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'ValidationError', 
        message: 'Todos los campos son requeridos' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'ValidationError', 
        message: 'La contraseña debe tener al menos 8 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'El correo electrónico ya está registrado' 
      });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      role: 'student'
    });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Guardar refresh token en base de datos (opcional)
    // await RefreshToken.create({ token: refreshToken, userId: user.id });

    // Generar token de verificación de email
    const emailVerificationToken = generateEmailVerificationToken(email);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'InternalServerError', 
      message: 'Error al registrar el usuario' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'ValidationError', 
        message: 'Correo y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'La cuenta está desactivada' 
      });
    }

    // Actualizar último login
    await user.update({ lastLogin: new Date() });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'InternalServerError', 
      message: 'Error al iniciar sesión' 
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        error: 'BadRequest', 
        message: 'Refresh token requerido' 
      });
    }

    // Verificar refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Buscar usuario
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Usuario no encontrado' 
      });
    }

    // Generar nuevos tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({
      message: 'Tokens renovados',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Error al renovar token:', error);
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Refresh token inválido' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'NotFound', 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      message: 'Perfil obtenido exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'InternalServerError', 
      message: 'Error al obtener el perfil' 
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  authLimiter
};