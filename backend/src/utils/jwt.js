const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generar tokens con firma real
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutos para access token
  };

  const refreshTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días para refresh token
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { 
    algorithm: 'HS256',
    expiresIn: '15m'
  });
  
  const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_REFRESH_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

// Verificar tokens
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

// Generar token de verificación de email
const generateEmailVerificationToken = (email) => {
  const payload = {
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  
  return jwt.sign(payload, process.env.EMAIL_VERIFICATION_SECRET, {
    algorithm: 'HS256'
  });
};

module.exports = {
  generateTokens,
  verifyToken,
  generateEmailVerificationToken
};