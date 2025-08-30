export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    // Decodificar token JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export const createFakeToken = (payload) => {
  // Crear un token simulado para desarrollo
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora
  }));
  return `${header}.${encodedPayload}.fake-signature`;
};