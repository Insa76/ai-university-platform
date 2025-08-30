const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token de acceso requerido' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Formato de token inválido' 
      });
    }

    // Verificar token
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'La cuenta está desactivada' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token inválido' 
      });
    }

    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      error: 'InternalServerError', 
      message: 'Error en autenticación' 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Autenticación requerida' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Permisos insuficientes' 
      });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};